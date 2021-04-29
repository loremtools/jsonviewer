#!/usr/bin/env bash

ROOTDIR=$(cd `dirname $0` && pwd)/..
cd $ROOTDIR/ui
npm install
npm run build
cd $ROOTDIR
mkdir -p $ROOTDIR/public/ui
cp -r $ROOTDIR/ui/build/* $ROOTDIR/public/ui
