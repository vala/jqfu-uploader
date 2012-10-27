;(function($) {

  // Uploader
  //
  // The idea behind this object is to keep everything in DOM and nodes
  // data-attributes so we keep everything in the same place and instead of
  // keeping references of DOM objects representing our files in the Uploader
  // object itself.
  // The latter approach could be a little faster but harder to work with when
  // extending it.
  //
  function Uploader() {
    // Keep current instance scope in constructor's sub-functions
    var self = this;

    // Memoize files list for faster access when accessing files nodes in DOM
    // so we never have to go through whole document to find one
    this.$files_list = $('#files-list');

    // Init file upload plugin
    $('#file-upload-input').fileupload({
      // Set drop zone for files to be DnDropped to upload plugin
      dropZone: $('#drop-zone'),
      // Bind callbacks to be handled by Uploader instance
      add: function(e, data) { self.addFiles(data); },
      progress: function(e, data) { self.uploadProgress(data); },
      done: function(e, data) { self.uploadDone(data); }
    });

    // Defer form submission to uploadFIles method
    $('#upload-form').on('submit', function(e) {
      e.preventDefault();
      self.uploadFiles();
    });
  }

  Uploader.prototype = {
    addFiles: function(data) {
      var self = this;

      // Make unique ID for uplaod from microseconds
      data.uid = (+(new Date())).toString();

      // For each file contained in passed data
      $.each(data.files, function(index, file) {
        // File container
        $('<div/>').addClass('file pending').attr('id', 'file-' + data.uid)
          .data('file-data', data).append(
            // File name
            $('<div/>').addClass('file-name').text(file.name),
            // Progress ratio
            $('<div/>').addClass('progress-ratio').text('0%'),
            // Progress container
            $('<div/>').addClass('progress-container').append(
              // Progress bar
              $('<div/>').addClass('progress-bar')
            ),
            // Floats clearing
            $('<div/>').addClass('clearfix')
          // Append created DOM object to files list
          ).appendTo(self.$files_list);
      })

    },

    // Handle "Upload Files" form submit button
    uploadFiles: function() {
      this.$files_list.find('.file.pending').each(function(i, el) {
        $(el).removeClass('pending').data('file-data').submit();
      });
    },

    // On progress event of each file data uploading
    uploadProgress: function(data) {
      var progress = parseInt(data.loaded / data.total * 100, 10) + '%';
      // Set progress ratio and bar size
      this.$files_list.find('#file-' + data.uid)
        .find('.progress-ratio').text(progress).end()
        .find('.progress-bar').css('width', progress);
    },

    // Just set success class when upload finished
    uploadDone: function(data) {
      this.$files_list.find('#file-' + data.uid).addClass('success');
    }
  };

  // Launch Uploader "class" when document is ready and let it handle uploads
  $(function() { new Uploader(); });

})(jQuery)