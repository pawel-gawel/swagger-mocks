#!/bin/bash

root_dir="$(dirname $(realpath $0))/../"

yamlPath=${1}
mocksPath=${2}

usage() {
  printf "\n\tUsage: swagger-mocks [-hv] path/to/yaml/file [path/to/mocked/data/dir]\n\n" >&2; exit 1
}

if [ -z $yamlPath ]; then
  usage 1>&2;
  exit
fi

while getopts ":hvf:m:" o; do
  case "${o}" in
    f)
      yamlPath=${OPTARG}
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

SWAGGER_MOCKS_YAML_PATH=$yamlPath \
SWAGGER_MOCKS_DATA_PATH=$mocksPath \
node ${root_dir}/src/index.js
