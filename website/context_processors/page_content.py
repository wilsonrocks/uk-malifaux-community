from website.models import PageContentText, Page


def page_content_context(request):

    view_name = request.resolver_match.view_name
    output = {}
    try:
        page = Page.objects.get(page_name=view_name)
        output["page"] = page

        try:
            content = PageContentText.objects.filter(page=page.id)
            output["page_content"] = {item.key: item.html for item in content}
        except PageContentText.DoesNotExist:
            pass

    except Page.DoesNotExist:
        pass

    return output
