import gettext

def translator(locale):
    return gettext.translation('service', localedir='locale', languages=[locale], fallback=True)
