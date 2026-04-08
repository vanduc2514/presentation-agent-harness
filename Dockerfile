FROM busybox:1.35

COPY dist /www

EXPOSE 80

ENTRYPOINT [ "busybox", "httpd" ]
CMD ["-f", "-v", "-p", "80", "-h", "/www"]
