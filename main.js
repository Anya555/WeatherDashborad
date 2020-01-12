$(document).ready(function () {

   for(var i=0; i < 8; i++){

    row = $("<div>");
    row.addClass("row");

    var textBlock = $("<div>");
    textBlock.addClass("col-4 text-block");

    var textarea = $("<textarea>");
    textBlock.append(textarea);

    $("#city-area").append(row);
    row.append(textBlock);
   }





});