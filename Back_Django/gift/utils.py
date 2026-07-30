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
    사용자 예산 범위에 최적화된 상품 상세 링크를 생성합니다.
    """
    fallback_price = 0
    final_image_url = None
    associate_tag = os.environ.get("AMAZON_ASSOCIATE_TAG", "golazo0d4-20")
    rapidapi_key = os.environ.get("RAPIDAPI_KEY")

    # 1. API 키 미존재 시 검색 URL로 대체
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

    # 2. RapidAPI 검색 요청 설정 (★ min_price, max_price 파라미터 적용)
    url = "https://real-time-amazon-data.p.rapidapi.com/search"

    querystring = {
        "query": search_keyword,
        "page": "1",
        "country": "US",
        "sort_by": "RELEVANCE",
        "product_condition": "NEW",
    }

    # 예산 조건이 명확히 주어진 경우 API 쿼리에 직접 전달하여 1차 정리
    if min_budget > 0:
        querystring["min_price"] = str(int(min_budget))
    if max_budget < 999999:
        querystring["max_price"] = str(int(max_budget))

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

    # 헬퍼 함수: 다양한 가격 필드 대응 및 파싱
    def parse_price(item_dict):
        # product_price, product_original_price, product_minimum_offer_price 순서로 확인
        price_candidates = [
            item_dict.get("product_price"),
            item_dict.get("product_original_price"),
            item_dict.get("product_minimum_offer_price"),
        ]
        for p in price_candidates:
            if p:
                try:
                    clean_p = str(p).replace("$", "").replace(",", "").strip()
                    val = float(clean_p)
                    if val > 0:
                        return val
                except (ValueError, TypeError):
                    continue
        return 0.0

    valid_candidates = []

    # 3. 받아온 아이템 리스트 중 예산 범위 검증
    for item in items:
        product_price = parse_price(item)

        # 예산 범위 내에 있는지 확인 (가격이 0인 것은 일단 제외 또는 예외 처리)
        if product_price > 0 and (min_budget <= product_price <= max_budget):
            valid_candidates.append((product_price, item))
        elif min_budget == 0 and product_price <= max_budget:
            valid_candidates.append((product_price, item))

    valid_item = None
    if valid_candidates:
        # 💡 예산 범위 내 candidate 중 예산 상한선(max_budget)에 가장 잘 들어맞는(가장 비싼/퀄리티 높은) 상품 선택
        # 필요하다면 리뷰 수/별점 정렬로도 변경 가능합니다.
        valid_candidates.sort(key=lambda x: x[0], reverse=True)
        valid_item = valid_candidates[0][1]

    # 4. 분기 처리 및 결과 반환
    if not valid_item:
        print(
            f"🛑 [Warning] No item found within budget for '{search_keyword}' ➔ Deploying Safe-Guard"
        )

        if items:
            first_item = items[0]
            raw_price = parse_price(first_item)
            final_price = (
                raw_price if (min_budget <= raw_price <= max_budget) else raw_price
            )
            final_product_name = first_item.get("product_title", search_keyword)
            final_image_url = first_item.get("product_photo")

            raw_url = first_item.get("product_url")
            earning_url = inject_associate_tag(raw_url, associate_tag, search_keyword)
            print(
                f"✨ [Safe-Guard Match]: {final_product_name} / Adjusted Price -> ${final_price}"
            )
        else:
            final_product_name = search_keyword
            final_price = fallback_price
            encoded_keyword = urllib.parse.quote_plus(search_keyword)
            earning_url = (
                f"https://www.amazon.com/s?k={encoded_keyword}&tag={associate_tag}"
            )
            final_image_url = None

    else:
        # 정상 매칭 성공 시 데이터 가공
        final_product_name = valid_item.get("product_title")
        final_price = parse_price(valid_item)
        final_image_url = valid_item.get("product_photo")

        raw_url = valid_item.get("product_url")
        earning_url = inject_associate_tag(raw_url, associate_tag, search_keyword)
        print(f"🍏 [Match Success]: {final_product_name} / ${final_price}")

    print("이미지 URL:", final_image_url)
    return {
        "product_name": final_product_name,
        "product_url": earning_url,
        "image_url": final_image_url,
        "price": final_price,
    }




def inject_associate_tag(original_url, tag, fallback_keyword):
    if not original_url:
        encoded_keyword = urllib.parse.quote_plus(fallback_keyword)
        return f"https://www.amazon.com/s?k={encoded_keyword}&tag={tag}"

    # 💡 [보완] 상대 경로(/dp/...)로 들어올 경우 호스트(domain) 붙여주기
    if original_url.startswith("/"):
        original_url = f"https://www.amazon.com{original_url}"

    parsed_url = urllib.parse.urlparse(original_url)
    query_params = urllib.parse.parse_qs(parsed_url.query)

    query_params["tag"] = [tag]

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
