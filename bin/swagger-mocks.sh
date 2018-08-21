#!/bin/bash

root_dir="$(dirname $(realpath $0))/../"

yaml=${1:-'api.yaml'}
data=${2:-'mocked-data'}

usage() {
  printf "\n\tUsage: swagger-mocks [-hv] [path/to/yaml/file] [path/to/mocked/data/dir]\n\n" >&2; exit 1
}

while getopts ":hvf:m:" o; do
  case "${o}" in
    f)
      yaml=${OPTARG}
      ;;
    m)
      data=${OPTARG}
      ;;
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

SWAGGER_MOCKS_YAML_PATH=$yaml \
SWAGGER_MOCKS_DATA_PATH=$data \
node ${root_dir}/src/index.js
