import gettext

def public_error(locale, error_code):
    catalog = gettext.translation('service', localedir='locale', languages=[locale], fallback=True)
    message = catalog.gettext('The account is temporarily locked.')
    return {"code": error_code, "message": message}
