$.getJSON("/article", function (data) {
  $(".articleList").empty();
  for (var i = 0; i < data.length; i++) {
      var newDiv = $("<div class='articleScrape row'>");
      newDiv.append("<p class='col-md-10 article'><img class='imageScrape' src=" + data[i].image + ">" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
      newDiv.append("<button data-toggle='modal' data-target='#exampleModal' type='button' data-id=" + data[i]._id + " class='col-md-2 commentBtn btn btn-info'>note</button>");
      $(".articleList").append(newDiv);
  };
});

$(".scrapeBtn").on("click", function () {
  $.ajax({
      method: "GET",
      url: "/scrape"
  })
  .then(function(data){
      location.reload();
      console.log(data);
  });
});

$(".removeBtn").on("click", function() {
  $.ajax({
      method: "DELETE",
      url: "/article",
  }).then(function (data) {
      console.log(data);
      location.reload();
  });
});

$(document).on("click", ".commentBtn", function () {
  var thisId = $(this).attr("data-id");

  console.log(thisId);

  $("#modalTitle").empty();
  $("#articleNotes").empty();
  $("#message-text").val("");


  $.ajax({
      method: "GET",
      url: "/article/" + thisId
  })
      .then(function (data) {
          console.log(data);
          console.log(data.note);
          $(".modal-body").prepend("<h2 id='modalTitle'>" + data.title + "</h2>");
          $(".submitBtn").attr("data-id", thisId);

          if (!data.note.length == 0) {
              for(var i = 0; i<data.note.length; i++){
                  $("#articleNotes").append("<p class='border border-dark' id='note'>"+data.note[i].body+"<button data-dismiss='modal' data-id='"+data.note[i]._id+"'type='button' class='btn btn-danger deleteBtn'>X</button></p>");
              }
          }
      });
});

$(document).on("click", ".submitBtn", function () {
  var postId = $(this).attr("data-id");

  var note = $("#message-text").val();

  $.ajax({
      method: "POST",
      url: "/article/" + postId,
      data: {
          body: note
      }
  })
      .then(function (data) {
          console.log(data);
          $("#message-text").empty();
      });
});

$(document).on("click", ".deleteBtn", function(){
  var deleteId = $(this).attr("data-id");
  var articleId = $(".submitBtn").attr("data-id");

  $.ajax({
      method: "DELETE",
      url: "/article/"+deleteId,
      data: {
          articleId: articleId
      }
  })
      .then(function(data){
          console.log("Deleted");
      });
});


// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });


// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });
