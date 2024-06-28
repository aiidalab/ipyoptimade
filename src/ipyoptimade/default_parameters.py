"""Default initialization parameters

The lists are set, based on the status of providers from
https://www.optimade.org/providers-dashboard/.
"""

# If the provider has no available databases, it should be put into the SKIP_PROVIDERS list,
# meaning it will not be supported.
SKIP_PROVIDERS = [
    "matcloud",
    "aiida",
    "ccpnc",
    "httk",
    "optimade",
    "optimake",
    "pcod",
    "exmpl",
    "necro",
]

# Providers in the DISABLE_PROVIDERS list are ones the client should support,
# but cannot because of one issue or another.
DISABLE_PROVIDERS = [
    # "aflow",
    # "cmr",
    # "cod",
    # "jarvis",
    # "mpdd",
    # "mpds",
    # "mpod",
    # "nmd",
    # "oqmd",
    # "tcod",
]

SKIP_DATABASE = {
    "Materials Cloud": ["optimade-sample", "li-ion-conductors", "sssp"],
}
