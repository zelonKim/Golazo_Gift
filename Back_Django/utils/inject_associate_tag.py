import urllib.parse

def inject_associate_tag(original_url: str, tag: str, fallback_keyword: str) -> str:
    """
    원본 URL에 제휴 어소시에이트 태그를 주입합니다. URL이 없으면 기본 키워드로 검색 URL을 생성합니다.
    """
    if not original_url:
        encoded_keyword = urllib.parse.quote_plus(fallback_keyword)
        return f"https://www.amazon.com/s?k={encoded_keyword}&tag={tag}"

    # 상대 경로인 경우 도메인 보정
    if original_url.startswith("/"):
        original_url = f"https://www.amazon.com{original_url}"

    parsed_url = urllib.parse.urlparse(original_url)
    query_params = urllib.parse.parse_qsl(parsed_url.query)

    # 기존 쿼리에 tag 파라미터 추가 또는 덮어쓰기
    query_params = [(k, v) for k, v in query_params if k != "tag"]
    query_params.append(("tag", tag))

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

