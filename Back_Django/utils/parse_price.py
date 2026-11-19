def parse_price(item_dict: dict) -> float:
    """
    상품 딕셔너리에서 가격 후보들을 탐색해 유효한 float 가격을 파싱합니다.
    """
    price_candidates = [
        item_dict.get("product_price"),
        item_dict.get("product_original_price"),
        item_dict.get("product_minimum_offer_price"),
    ]
    
    for p in price_candidates:
        if p:
            try:
                # 문자열에서 특수문자 제거 후 float 변환
                clean_p = str(p).replace("$", "").replace(",", "").strip()
                val = float(clean_p)
                if val > 0:
                    return val
            except (ValueError, TypeError):
                continue
                
    return 0.0



