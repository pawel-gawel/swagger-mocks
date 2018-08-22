#!/bin/bash

root_dir="$(dirname $(realpath $0))/../"

yaml=${1:-'api.yaml'}
mocksPath=${2}

usage() {
  printf "\n\tUsage: swagger-mocks [-hv] path/to/yaml/file [path/to/mocked/data/dir]\n\n" >&2; exit 1
}

while getopts ":hvf:m:" o; do
  case "${o}" in
    f)
      yaml=${OPTARG}
      ;;
    m)
      mocksPath=${OPTARG}
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
SWAGGER_MOCKS_DATA_PATH=$mocksPath \
node ${root_dir}/src/index.js
