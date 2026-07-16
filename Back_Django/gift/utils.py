# gift/utils.py
import hmac
import hashlib
import requests
import time
import os
import urllib.parse
from amazon_creatorsapi import AmazonCreatorsApi, Country


# def get_amazon_product(search_keyword, min_budget=0, max_budget=999999):

#     # 1. 안전 가드값
#     fallback_price = 0
#     image_url = None

#     # 아마존 자격 증명 (Railway 환경변수 또는 .env에 등록 필요)
#     credential_id = os.environ.get("AMAZON_ACCESS_KEY")
#     credential_secret = os.environ.get("AMAZON_SECRET_KEY")
#     associate_tag = os.environ.get("AMAZON_ASSOCIATE_TAG")

#     if not (credential_id and credential_secret and associate_tag):
#         return {
#             "product_name": f"{search_keyword}",
#             "product_url": f"https://www.amazon.com/s?k={urllib.parse.quote(search_keyword)}",
#             "image_url": image_url,
#             "price": fallback_price,
#         }

#     # 아마존 API 클라이언트 초기화
#     amazon = AmazonCreatorsApi(
#         credential_id=credential_id,
#         credential_secret=credential_secret,
#         tag=associate_tag,
#         country=Country.US,
#         version="2.2",
#     )

#     try:
#         # [1차 방어선] LLM이 넘겨준 키워드로 아마존 검색 요청 (최대 10개 아이템을 받아와 필터링)
#         # SearchItems 작업을 통해 가격과 이미지를 함께 받아옵니다.
#         search_result = amazon.search_items(
#             keywords=search_keyword,
#             item_count=10,
#             resources=[
#                 "ItemInfo.Title",
#                 "Offers.Listings.Price",
#                 "Images.Primary.Medium",
#                 "DetailPageURL",  # 어소시에이트 트래킹 태그가 자동 삽입된 링크
#             ],
#         )

#         items = search_result.items if search_result else []

#     except Exception as e:
#         print(f"❌ Amazon API Request Error: {e}")
#         items = []

#     valid_item = None

#     # 받아온 10개 아이템 중 예산 범위(min_budget ~ max_budget)에 맞는 실재하는 첫 번째 아이템 탐색
#     for item in items:
#         try:
#             # 아마존은 가격 정보를 달러 센트(Cents) 단위 혹은 문자열로 리턴하므로 소수점 가공 필요
#             price_amount = (
#                 item.offers.listings[0].price.amount
#                 if item.offers and item.offers.listings
#                 else None
#             )
#             if price_amount is None:
#                 continue

#             product_price = float(price_amount)

#             if min_budget <= product_price <= max_budget:
#                 valid_item = item
#                 break
#         except (IndexError, AttributeError):
#             continue

#     # [2차 방어선] 1차 조사에서 예산 내에 알맞은 상품이 전멸한 경우
#     if not valid_item:
#         print(
#             f"🛑 [Warning] No item found within budget for '{search_keyword}' ➔ Deploying Safe-Guard"
#         )

#         if items:
#             # 예산 범위는 벗어났지만, 검색된 가장 정확도 높은 1위 아마존 실제 상품 정보 사용
#             first_item = items[0]
#             try:
#                 raw_price = (
#                     float(first_item.offers.listings[0].price.amount)
#                     if first_item.offers and first_item.offers.listings
#                     else fallback_price
#                 )
#             except (IndexError, AttributeError):
#                 raw_price = fallback_price

#             # 가격이 범위를 벗어나 있다면 비즈니스 로직(UI 통일성)을 위해 강제로 중간값 등으로 보정 마사지
#             if raw_price < min_budget or raw_price > max_budget:
#                 final_price = fallback_price
#             else:
#                 final_price = raw_price

#             final_product_name = first_item.item_info.title.display_value
#             image_url = (
#                 first_item.images.primary.medium.url if first_item.images else None
#             )
#             earning_url = first_item.detail_page_url

#             print(
#                 f"✨ [Safe-Guard Match]: {final_product_name} / Adjusted Price -> ${final_price}"
#             )
#         else:
#             # 아마존에 아예 해당 키워드 검색 결과가 0건인 초극단적 상황 가드
#             final_product_name = search_keyword
#             final_price = fallback_price
#             earning_url = (
#                 f"https://www.amazon.com/s?k={urllib.parse.quote(search_keyword)}"
#             )

#     else:
#         # 정상 매칭 성공 시
#         final_product_name = valid_item.item_info.title.display_value
#         final_price = float(valid_item.offers.listings[0].price.amount)
#         image_url = valid_item.images.primary.medium.url if valid_item.images else None
#         earning_url = valid_item.detail_page_url
#         print(f"🍏 [Match Success]: {final_product_name} / ${final_price}")

#     return {
#         "product_name": final_product_name,
#         "product_url": earning_url,  # 어소시에이트 태그가 삽입되어 즉시 수익 정산 가능한 정식 URL
#         "image_url": image_url,
#         "price": final_price,
#     }


###############################################################################


def get_amazon_product(search_keyword, min_budget=0, max_budget=999999):
    """
    RapidAPI(Real-Time Amazon Data API)를 이용하여 아마존 실시간 상품 정보(이미지, 가격)를 조회하고
    내 어소시에이트 태그가 이식된 최종 상품 상세 링크를 생성합니다.
    """
    # 1. 기본 안전 가드값 및 트래킹 태그 설정
    fallback_price = 0
    final_image_url = None  # 💡 변수명을 꼬이지 않게 명확히 설정합니다.
    associate_tag = os.environ.get("AMAZON_ASSOCIATE_TAG", "golazo0d4-20")
    rapidapi_key = os.environ.get("RAPIDAPI_KEY")

    if not rapidapi_key:
        encoded_keyword = urllib.parse.quote_plus(search_keyword)
        fallback_search_url = (
            f"https://www.amazon.com/s?k={encoded_keyword}&tag={associate_tag}"
        )
        print(
            f"⚠️ [RapidAPI Warning] No RAPIDAPI_KEY found. Falling back to Search URL."
        )
        return {
            "product_name": search_keyword,
            "product_url": fallback_search_url,
            "image_url": final_image_url,
            "price": fallback_price,
        }

    # 2. RapidAPI를 통한 실시간 아마존 상품 검색 요청
    url = "https://real-time-amazon-data.p.rapidapi.com/search"
    querystring = {
        "query": search_keyword,
        "page": "1",
        "country": "US",
        "sort_by": "RELEVANCE",
        "product_condition": "NEW",
    }
    headers = {
        "X-RapidAPI-Key": rapidapi_key,
        "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
    }

    items = []
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=8)
        if response.status_code == 200:
            res_json = response.json()
            if res_json.get("status") == "OK" and "data" in res_json:
                items = res_json["data"].get("products", [])
        else:
            print(f"❌ RapidAPI Error Status: {response.status_code}")
    except Exception as e:
        print(f"❌ RapidAPI Connection Error: {e}")

    valid_item = None

    # 3. 받아온 아이템 리스트 중 예산 범위에 부합하는 첫 번째 아이템 탐색
    for item in items:
        try:
            price_str = item.get("product_price")
            if not price_str:
                continue
            product_price = float(price_str.replace("$", "").replace(",", ""))

            if min_budget <= product_price <= max_budget:
                valid_item = item
                break
        except (ValueError, TypeError, AttributeError):
            continue

    # 4. [보안 가드] 분기 처리 철저하게 가이드
    if not valid_item:
        print(
            f"🛑 [Warning] No item found within budget for '{search_keyword}' ➔ Deploying Safe-Guard"
        )

        if items:
            # 예산은 맞지 않지만, 검색 상위 1위 아이템 정보 탈취
            first_item = items[0]
            try:
                raw_price_str = first_item.get("product_price", "0")
                raw_price = float(raw_price_str.replace("$", "").replace(",", ""))
            except (ValueError, TypeError):
                raw_price = fallback_price

            final_price = (
                raw_price if min_budget <= raw_price <= max_budget else fallback_price
            )
            final_product_name = first_item.get("product_title", search_keyword)

            # 💡 [핵심 해결 1] Safe-Guard 상품의 이미지를 전역 변수에 정확하게 전달!
            final_image_url = first_item.get("product_photo")

            raw_url = first_item.get("product_url")
            earning_url = inject_associate_tag(raw_url, associate_tag, search_keyword)
            print(
                f"✨ [Safe-Guard Match]: {final_product_name} / Adjusted Price -> ${final_price}"
            )
        else:
            # 아예 검색 결과 자체가 없을 때 초극단 방어선
            final_product_name = search_keyword
            final_price = fallback_price
            encoded_keyword = urllib.parse.quote_plus(search_keyword)
            earning_url = (
                f"https://www.amazon.com/s?k={encoded_keyword}&tag={associate_tag}"
            )
            final_image_url = None  # 검색 결과 자체가 없으므로 이미지 없음

    else:
        # 정상 매칭 성공 시 데이터 가공
        final_product_name = valid_item.get("product_title")
        price_str = valid_item.get("product_price", "0")
        final_price = float(price_str.replace("$", "").replace(",", ""))

        # 💡 [핵심 해결 2] 정상 매칭된 상품의 이미지를 변수에 할당!
        final_image_url = valid_item.get("product_photo")

        raw_url = valid_item.get("product_url")
        earning_url = inject_associate_tag(raw_url, associate_tag, search_keyword)
        print(f"🍏 [Match Success]: {final_product_name} / ${final_price}")



    print("이미지 URL:", final_image_url)
    # 최종 리턴 딕셔너리에 바인딩
    return {
        "product_name": final_product_name,
        "product_url": earning_url,
        "image_url": final_image_url,  
        "price": final_price,
    }


def inject_associate_tag(original_url, tag, fallback_keyword):
    """
    크롤링으로 가져온 원본 아마존 주소에 내 어소시에이트 태그를
    강제로 주입하거나 교체하여 정상적으로 정산되게 만드는 헬퍼 함수입니다.
    """
    if not original_url:
        encoded_keyword = urllib.parse.quote_plus(fallback_keyword)
        return f"https://www.amazon.com/s?k={encoded_keyword}&tag={tag}"

    parsed_url = urllib.parse.urlparse(original_url)
    query_params = urllib.parse.parse_qs(parsed_url.query)

    # 기존에 타인이 심어둔 태그가 있거나 누락되어 있다면 내 태그로 강제 덮어쓰기
    query_params["tag"] = [tag]

    # 쿼리 파라미터 재구성 및 도메인 복구
    new_query = urllib.parse.urlencode(query_params, doseq=True)

    customized_url = urllib.parse.urlunparse(
        (
            parsed_url.scheme,
            parsed_url.netloc,
            parsed_url.path,
            parsed_url.params,
            new_query,
            parsed_url.fragment,
        )
    )
    return customized_url
