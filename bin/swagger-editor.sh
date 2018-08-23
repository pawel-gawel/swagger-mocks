#!/bin/bash

root_dir="$(dirname $(realpath $0))/../"
swagger="${root_dir}node_modules/.bin/swagger"

swagger project edit