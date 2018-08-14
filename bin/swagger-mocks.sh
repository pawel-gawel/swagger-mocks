#!/bin/bash

yaml=${1:-'elo.yaml'}

usage() {
  printf "\n\tUsage: swagger-mocks [-hv] [path/to/yaml/file]\n\n" >&2; exit 1
}

while getopts ":hv" o; do
  case "${o}" in
    h)
      usage
      ;;
    v)
      set -x
      ;;
    \?)
      printf "\n\tInvalid option: -$OPTARG\n\n" >&2; usage
      ;;
  esac
done
shift $((OPTIND-1))

SWAGGER_MOCKS_YAML_PATH=$yaml node src/index.js