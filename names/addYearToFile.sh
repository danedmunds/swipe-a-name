#!/bin/bash
year=$(echo $1 | sed 's/[^0-9]//g')
while read -r line || [[ -n "$line" ]]; do
    echo $year,$line >> all.csv
done < "$1"