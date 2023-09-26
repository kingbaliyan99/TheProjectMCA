$(document).ready(function(){

    var setModeObj = {
        "48": "c_cpp",
        "52": "c_cpp",
        "51": "csharp",
        "60": "golang",
        "62": "java",
        "62": "java",
        "63": "javascript",
        "71": "python",
        "43": "text"
    }

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    $('#language-id').on('change', (event) => {
        var languageID = event.target.value;
        editor.session.setMode("ace/mode/"+setModeObj[languageID]);
    });
    
    
    var console_editor = ace.edit('status-div')

    var input_editor = ace.edit('input-div');
    // input_editor.setTheme("ace/theme/monokai");
    input_editor.session.setMode("ace/mode/text");

    var output_editor = ace.edit('output-div');
    // output_editor.setTheme("ace/theme/monokai");
    output_editor.session.setMode("ace/mode/text");

    //Submission
    $('#submit-code').click((event) => {
        event.preventDefault();
        $('#submit-code').html("Submitting...");
        $('#submit-code').prop('disabled', true);
        editor.setReadOnly(true);
        var source_code = editor.getValue();
        
        //url = "http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true";
          url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
    //       var langs =  $('#language-id').val();
    //     console.log(langs)
    //      switch(langs){
    //         case '4': langs = 48; break;
    //         case '10': langs=52; break;
    //         case '34': langs=71; break;
    //         case '26': langs=62; break;
    //         case '16': langs=51; break;
    //         case '29': langs=63; break;
    //         case '22': langs=60; break;
    // }
        body = {
            "source_code": source_code,
            "language_id": $('#language-id').val()
        }
        var stdin = input_editor.getValue();
        if(stdin !== ""){
            body['stdin'] = stdin;
        }

        $.ajax({
            type: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                 'X-RapidAPI-Key': '023d02e065msh8f2b393c384d2c9p1b4aacjsne02fc4e4aceb',
		            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: JSON.stringify(body),
            success: function(data){
                console.log(data.token);
                $.ajax({
                    type: 'GET',
                    //url: "http://sntc.iitmandi.ac.in:3000/submissions/"+data.token+"?base64_encoded=false",
                      url: "https://ce.judge0.com/submissions/"+data.token+"?base64_encoded=false",
                    headers: {
                        'Content-Type': 'application/json',
                         'X-RapidAPI-Key': '023d02e065msh8f2b393c384d2c9p1b4aacjsne02fc4e4aceb',
		                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    },
                    success: function(data){
                        console.log(data);
                        $('#submit-code').prop('disabled', false);
                        $('#submit-code').html("Submit");
                        editor.setReadOnly(false);
                        if(data.stdout !== null){
                            output_editor.setValue(data.stdout);
                            output_editor.setReadOnly(true);
                            output_editor.clearSelection();
                        }
                        var status_text = data.status.description;
                        var stderr = data.stderr;
                        if(status_text!==null){
                            console_editor.setValue("Status: " + status_text);
                            console_editor.clearSelection();
                            console_editor.setReadOnly(true);
                        }
                        if(stderr !== null){
                            var final_console_text = "Status: "+status_text+"\n\n"+stderr;
                            console_editor.setValue(final_console_text);
                            console_editor.clearSelection();
                            console_editor.setReadOnly(true);
                        }
                        
                    },
                    error: function(e){
                        console.log(e);
                    }
                })
                
            },
            // error: function(e){
            //     console.log(e);
            // }
            error: function(jqXHR, textStatus, errorThrown){
                console.log("AJAX Error: " + textStatus, errorThrown);
            }
        })
    })

// $(document).ready(function() {
//     var setModeObj = {
//         "4": "c_cpp",
//         "10": "c_cpp",
//         "16": "csharp",
//         "22": "golang",
//         "26": "java",
//         "27": "java",
//         "29": "javascript",
//         "34": "python",
//         "43": "text"
//     }

//     var editor = ace.edit("editor");
//     editor.setTheme("ace/theme/monokai");
    
//     // Add an event listener to the language select element
//     $('#language-id').on('change', function(event) {
//         var languageID = event.target.value;
//         editor.session.setMode("ace/mode/" + setModeObj[languageID]);
//     });

//     var console_editor = ace.edit('status-div')
//     var input_editor = ace.edit('input-div');
//     input_editor.session.setMode("ace/mode/text");
//     var output_editor = ace.edit('output-div');
//     output_editor.session.setMode("ace/mode/text");

//     // Submission
//     $('#submit-code').click(function(event) {
//         event.preventDefault();
//         $('#submit-code').html("Submitting...");
//         $('#submit-code').prop('disabled', true);
//         editor.setReadOnly(true);
//         var source_code = editor.getValue();
        
//         var clientId = 'a09580c19eb6a86c4ec207a562b68e46'; // Replace with your JDoodle client ID
//         var clientSecret = 'aa397dd173fd60129b6420e2a951551f27502ac279a14dd94284948969d3bac6'; // Replace with your JDoodle client secret

//         // JDoodle API URL
//          var proxyUrl = '/proxy/';
        
//         var language = $('#language-id').val(); // Get the selected language
        
//         // JDoodle API request body
//         var body = {
//             clientId: clientId,
//             clientSecret: clientSecret,
//             script: source_code,
//             language: language,
//             versionIndex: '0', // Specify the version of the language (0 for default)
//         };

//         // Make an AJAX POST request to the JDoodle API
//         $.ajax({
//             type: 'POST',
//             url: proxyUrl,
//             dataType: 'json',
//             data: JSON.stringify(body),
//             contentType: 'application/json',
//             success: function(data) {
//                 console.log(data);
//                 // Handle the JDoodle API response data here
//                 // Update the output_editor with the result
//                 output_editor.setValue(data.output);
//                 output_editor.setReadOnly(true);
//                 output_editor.clearSelection();
                
//                 // You can also update the console_editor with status information
//                 console_editor.setValue("Status: " + data.statusCode);
//                 console_editor.clearSelection();
//                 console_editor.setReadOnly(true);
//             },
//             error: function(jqXHR, textStatus, errorThrown) {
//                 console.error(textStatus, errorThrown);
//             },
//             complete: function() {
//                 $('#submit-code').prop('disabled', false);
//                 $('#submit-code').html("Submit");
//                 editor.setReadOnly(false);
//             }
//         });
//     });



// $(document).ready(function () {
//     var setModeObj = {
//         "4": "c_cpp",
//         "10": "c_cpp",
//         "16": "csharp",
//         "22": "golang",
//         "26": "java",
//         "27": "java",
//         "29": "javascript",
//         "34": "python",
//         "43": "text"
//     };

//     var editor = ace.edit("editor");
//     editor.setTheme("ace/theme/monokai");
//     $('#language-id').on('change', (event) => {
//         var languageID = event.target.value;
//         editor.session.setMode("ace/mode/" + setModeObj[languageID]);
//     });

//     var console_editor = ace.edit('status-div');
//     var input_editor = ace.edit('input-div');
//     input_editor.session.setMode("ace/mode/text");
//     var output_editor = ace.edit('output-div');
//     output_editor.session.setMode("ace/mode/text");

//     // Submission
//     $('#submit-code').click((event) => {
//         event.preventDefault();
//         $('#submit-code').html("Submitting...");
//         $('#submit-code').prop('disabled', true);
//         editor.setReadOnly(true);
//         var source_code = editor.getValue();

//         // Use the custom Codex API URL
//         url = 'https://api.codex.jaagrav.in'; // Update the URL

//         var langs =  $('#language-id').val();
//         console.log(langs)
//         switch(langs){
//             case '4': langs = "c"; break;
//             case '10': langs="cpp"; break;
//             case '34': langs="py"; break;
//             case '16': langs="cs"; break;
//             case '29': langs="js"; break;
//             case '22': langs="go"; break;

//         }
//         body = {
//             "code": source_code, // Codex-specific field
//            // "language": $('#language-id').val(), // Codex-specific field
//             "language": langs,
//             "input": input_editor.getValue(), // Codex-specific field
//         };

//         // Make the Codex API call
//         $.ajax({
//             type: 'POST',
//             url: url,
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             data: body, // Send the data as-is
//             success: function (response) {
//                 console.log(JSON.stringify(response.output));
//                 console.log(response);

//                 // You can process the response data here if needed
//                 // For example, update your output_editor with the response
//                 output_editor.setValue(response.output);

//                 console_editor.setValue("Status: " + response.status);
//                 //console_editor.setValue("Language : " + response.info);
//                 console_editor.setReadOnly(true);

//                 $('#submit-code').prop('disabled', false);
//                 $('#submit-code').html("Submit");
//                 editor.setReadOnly(false);
//             },
//             error: function (error) {
//                 console.log(error);
//             },
//         });
//     });







    $('#chat-btn').click((event) => {
        event.preventDefault();
        $('#chat-div').show();
    });

    $('#chat-close').click((event) => {
        event.preventDefault();
        $('#chat-div').hide();
    });

    $('#clear-editor').click((event) => {
        event.preventDefault();
        if(confirm("Are you sure you want to clear the Editor?")){
            editor.setValue("");
        }
    });

    $('#user-close').click((event) => {
        event.preventDefault();
        $('#user-div').hide();
    })

    $('#show-user').click((event) => {
        event.preventDefault();
        $('#user-div').show();
    })

    $('#wboard-close').click((event) => {
        event.preventDefault();
        $('#draw').hide();
    });
    
    $('#show-wboard').click((event) => {
        event.preventDefault();
        $('#draw').show();
    })
})


// Jdoodle
// client id
// a09580c19eb6a86c4ec207a562b68e46

// sercet Key
// aa397dd173fd60129b6420e2a951551f27502ac279a14dd94284948969d3bac6