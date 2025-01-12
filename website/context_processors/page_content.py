from website.models import PageContentText, Page


def page_content_context(request):
    view_name = request.resolver_match.view_name

    page = Page.objects.get(page_name=view_name)
    content = PageContentText.objects.get(page=page.id)
    return {"page_content": content, "page": page}
