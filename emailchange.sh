git filter-branch -f --env-filter '
    oldname="Dani Guardiola"
    oldemail="contacto@daniguardiola.me"
    newname="DaniGuardiola"
    newemail="contacto@daniguardiola.me"
    [ "$GIT_AUTHOR_EMAIL"="$oldemail" ] && GIT_AUTHOR_EMAIL="$newemail"
    [ "$GIT_COMMITTER_EMAIL"="$oldemail" ] && GIT_COMMITTER_EMAIL="$newemail"
    [ "$GIT_AUTHOR_NAME"="$oldname" ] && GIT_AUTHOR_NAME="$newname"
    [ "$GIT_COMMITTER_NAME"="$oldname" ] && GIT_COMMITTER_NAME="$newname"
    ' HEAD
