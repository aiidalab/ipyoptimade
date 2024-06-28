"""Test root utils.py functions"""
# pylint: disable=import-error


def test_fetch_providers_wrong_url():
    """Test when fetch_providers is provided a wrong URL

    It should now return at the very least the cached list of providers
    """
    import json

    from ipyoptimade import utils

    wrong_url = "https://this.is.a.wrong.url"

    providers = utils.fetch_providers(providers_urls=wrong_url)
    if utils.CACHED_PROVIDERS.exists():
        with open(utils.CACHED_PROVIDERS, "r", encoding="utf8") as handle:
            providers_file = json.load(handle)
        assert providers == providers_file.get("data", [])
    else:
        assert providers == []


def test_fetch_providers_content():
    """Test known content in dict of database providers"""
    from ipyoptimade.utils import fetch_providers

    exmpl = {
        "type": "links",
        "id": "exmpl",
        "attributes": {
            "name": "Example provider",
            "description": "Provider used for examples, not to be assigned to a real database",
            "base_url": "https://providers.optimade.org/index-metadbs/exmpl",
            "homepage": "https://example.com",
            "link_type": "external",
        },
    }

    assert exmpl in fetch_providers()


def test_exmpl_not_in_list():
    """Make sure the 'exmpl' database provider is not in the final list"""
    from ipyoptimade.utils import get_list_of_providers

    exmpl = "Example provider"
    mcloud = "Materials Cloud"
    odbx = "open database of xtals"

    providers_list = get_list_of_providers()

    enabled_providers = [p["text"] for p in providers_list if not p["disabled"]]
    disabled_providers = [p["text"] for p in providers_list if p["disabled"]]

    assert exmpl not in enabled_providers, providers_list
    assert exmpl not in disabled_providers, providers_list
    assert mcloud in enabled_providers, providers_list
    assert mcloud not in disabled_providers, providers_list
    assert odbx in enabled_providers, providers_list
    assert odbx not in disabled_providers, providers_list


def test_ordered_query_url():
    """Check ordered_query_url().

    Testing already sorted URLs, making sure they come out exactly the same as when they came in.
    """
    from ipyoptimade.utils import ordered_query_url

    normal_url = (
        "https://optimade.materialsproject.org/v1/structures?filter=%28+nelements%3E%3D1+AND+"
        "nelements%3C%3D9+AND+nsites%3E%3D1+AND+nsites%3C%3D444+%29&page_limit=25&page_number=1&page_offset=30&response_format"
        "=json"
    )
    multi_query_param_url = (
        "https://optimade.materialsproject.org/v1/structures?filter=%28+nelements%3E%3D1+AND+"
        "nelements%3C%3D9+AND+nsites%3E%3D1+AND+nsites%3C%3D444+%29&page_limit=25&page_number=1&page_offset=30&response_format"
        "=json&response_format=xml"
    )

    ordered_url = ordered_query_url(normal_url)
    assert ordered_url == normal_url

    ordered_url = ordered_query_url(multi_query_param_url)
    assert ordered_url == multi_query_param_url
