$(document).ready(function () {

    $(document).on("click", ".saveArticle", function () {
        event.preventDefault();
        var thisId = $(this).attr("data-id");
        $.ajax({
            url: "/api/index/" + thisId,
            method: "PUT"
        }).then(function (data) {
            location.reload();
        });
    });

    $(document).on("click", ".unsaveArticle", function () {
        event.preventDefault();
        var thisId = $(this).attr("data-id");
        $.ajax({
            url: "/api/saved/" + thisId,
            method: "PUT"
        }).then(function (data) {
            location.reload();
        });
    });

    $(document).on("click", ".addNote", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/saved/" + thisId
        })
            .then(function (data) {
                $("#notes").append("<p id='bodyinput' name='body'></p>");
                if (data.notes) {
                    console.log(data.notes);
                    for (i in data.notes) {
                        $("#bodyinput").append(data.notes[i].body + "<br>");
                    }
                }
            });
        $("#modal" + thisId).show();
    });

    $(document).on("click", ".saveNote", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
            url: "/saved/" + thisId,
            method: "POST",
            data: {
                body: $("#noteInput").val().trim()
            }
        })
    });

    $(document).on("click", ".closeNote", function () {
        $("#notes").empty();
        $(".modal").hide();
    });

})