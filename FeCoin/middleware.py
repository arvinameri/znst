class FixDuplicateProxyHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # حل مشکل تکرار در Origin (برای رفع ارور CSRF)
        if 'HTTP_ORIGIN' in request.META:
            request.META['HTTP_ORIGIN'] = request.META['HTTP_ORIGIN'].split(',')[0]
        
        # حل مشکل تکرار در پروتکل (برای جلوگیری از لوپ SSL)
        if 'HTTP_X_FORWARDED_PROTO' in request.META:
            request.META['HTTP_X_FORWARDED_PROTO'] = request.META['HTTP_X_FORWARDED_PROTO'].split(',')[0]
            
        return self.get_response(request)