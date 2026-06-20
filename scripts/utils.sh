#!/bin/bash
# MAXTER // Version 27.4.B1
# Shared Utilities

REPO_DIR="$HOME/.MAXTER"
PROPS_FILE="$REPO_DIR/version.properties"

get_version() {
    local fallback="27.4.B1"
    if [ -f "$PROPS_FILE" ]; then
        local v_main=$(grep 'MAIN=' "$PROPS_FILE" | cut -d'=' -f2)
        local v_minor=$(grep 'MINOR=' "$PROPS_FILE" | cut -d'=' -f2)
        local v_build=$(grep 'BUILD=' "$PROPS_FILE" | cut -d'=' -f2)
        echo "$v_main.$v_minor.B$v_build"
    else
        echo "$fallback"
    fi
}

# Add more shared functions here (e.g., logging, system detection)
