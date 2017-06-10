<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="com.google.common.net.PercentEscaper" %>
<%@ page import="net.retorx.ImageContent" %>
<%@ page import="org.apache.commons.lang3.StringEscapeUtils" %>
<%
  PercentEscaper e = new PercentEscaper("", false);
  ImageContent imageContent = (ImageContent) request.getAttribute("imageContent");
  String name = imageContent != null ? imageContent.getCustomName() : "";
  String info = imageContent != null ? imageContent.getInfo() : "";
  String description = name + " by artist Dave Clay. " + StringEscapeUtils.escapeHtml4(info);
  String pageURL = "http://daveclay.com/share/?gid=" + e.escape(request.getParameter("gid")) + "&pid=" + e.escape(request.getParameter("pid"));
  String imageURL = "http://daveclay.com/services/images/image/scaled/" + e.escape(request.getParameter("pid")) + ".png";
%>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://ogp.me/ns/fb#">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
  <link rel="shortcut icon" href="http://daveclay.com/favicon.png" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Art of Dave Clay" />
  <meta property="og:description" content="<%= description %>" />
  <meta property="og:url" content="<%= pageURL %>" />
  <meta property="og:image" content="<%= imageURL %>" />
  <meta property="og:image:width" content="<%= imageContent.getImageFileByVersion("scaled").get().width() %>"/>
  <meta property="og:image:height" content="<%= imageContent.getImageFileByVersion("scaled").get().height() %>"/>

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@daveclay" />
  <meta name="twitter:creator" content="@daveclay" />
  <meta name="twitter:title" content="<%= name %>" />
  <meta name="twitter:description" content="<%= description %>" />
  <meta name="twitter:image" content="<%= imageURL %>" />

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

