#!/bin/bash

for file in * ; do
  name=${file%.md}
  echo "$name of $file"
  cp "$file" "$name.fi.md"
done
