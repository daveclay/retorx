<%@ page import="java.net.URLEncoder" %>
<%@ page import="org.apache.http.client.utils.URLEncodedUtils" %>
<%@ page import="com.google.common.net.PercentEscaper" %>
<%!
  PercentEscaper e = new PercentEscaper("", false);
%>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://ogp.me/ns/fb#">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
  <link rel="shortcut icon" href="http://daveclay.com/favicon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Art of Dave Clay" />
  <meta property="og:description" content="<%= request.getParameter("pid") %> by artist Dave Clay." />
  <meta property="og:url" content="http://daveclay.com/share/?gid=<%= e.escape(request.getParameter("gid")) %>&pid=<%= e.escape(request.getParameter("pid")) %>" />
  <meta property="og:image" content="http://daveclay.com/services/images/image/scaled/<%= e.escape(request.getParameter("pid")) %>.png" />
  <meta name="viewport"
        content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="keywords" content="daveclay, art, painting, figure, drawing, pen, ink">
  <meta name="description" content="art of daveclay">
  <title>Dave Clay Art</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
  <link rel="stylesheet" href="../css/main.css">
</head>
<body>
<div id="root"></div>
<script type="text/javascript" src="../js/main.bundle.js"></script>
</body>

