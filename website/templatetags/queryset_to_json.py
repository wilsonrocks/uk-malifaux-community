import json
from django import template

register = template.Library()


@register.filter(name="queryset_to_json")
def to_json(value):
    """Convert a QuerySet or object to a JSON string."""
    if isinstance(value, list):
        return json.dumps(value)
    elif hasattr(value, "values"):  # Handle QuerySet
        return json.dumps(list(value.values()))
    return json.dumps(value)
