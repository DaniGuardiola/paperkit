rm -rf newver/
mkdir newver/
wget --mirror --page-requisites --adjust-extension --no-parent --convert-links --directory-prefix=sousers https://www.google.com/design/spec/
meld / newver/