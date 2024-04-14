#!/bin/bash

export dir="$PWD"
cd ${dir}/auth-service && yarn

cd ${dir}/post-service && yarn

cd ${dir}/realtime-server && yarn

cd ${dir}/web && yarn
