rm -rf newver/
mkdir newver
pushd newver/
wget --mirror --page-requisites --adjust-extension --no-parent --convert-links --directory-prefix=sousers https://www.google.com/design/spec/
popd
mv newver/sousers/www.google.com/design/spec/ .
rm -rf newver/
mv spec/ newver/
meld -a . newver/
rm -rf lastver/
mv newver/ lastver/