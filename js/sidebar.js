/**
 * Audio Player
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the LICENSE.md file.
 *
 * @author Marcel Scherello <audioplayer@scherello.de>
 * @copyright 2016-2017 Marcel Scherello
 */

Audios.prototype.showSidebar = function (evt) {

    var trackid = $(evt.target).closest('a').attr('data-trackid');
    var $appsidebar = $("#app-sidebar");

    if ($appsidebar.data('trackid') === trackid) {
        $appsidebar.data('trackid','');
        $this.hideSidebar();
    } else {

        $appsidebar.data('trackid',trackid);
        var getcoverUrl = OC.generateUrl('apps/audioplayer/getcover/');
        var cover = $(evt.target).closest('li').attr('data-cover');

        if (cover !== '') {
            $('#sidebarThumbnail').attr({
                'style':'background-image:url('+getcoverUrl+cover+')'
            });
        }

        $('#sidebarClose').click($this.hideSidebar.bind($this));
        $('#tabHeaderAudiplayer').click($this.audioplayerTabView.bind($this));

        if ($('#audioplayer_editor').val() === 'true') {
            $('#tabHeaderID3Editor').click($this.APEditorTabView.bind($this));
        } else {
            $('#tabHeaderID3Editor').click($this.ID3EditorTabView.bind($this));
        }

        $this.audioplayerTabView();
        // noinspection JSUnresolvedFunction
        OC.Apps.showAppSidebar();
        $('.sm2-bar-ui').width(myAudios.PlaylistContainer.width());
    }
};

Audios.prototype.hideSidebar = function () {
    // noinspection JSUnresolvedFunction
    OC.Apps.hideAppSidebar();
    $('.sm2-bar-ui').width(myAudios.PlaylistContainer.width());
    $('#audioplayerTabView').html('');
    $('#ID3EditorTabView').html('');
};

Audios.prototype.audioplayerTabView = function () {

    var trackid = $("#app-sidebar").data('trackid');

    $('#tabHeaderAudiplayer').addClass('selected');
    $('#tabHeaderID3Editor').removeClass('selected');
    $('#ID3EditorTabView').addClass('hidden');
    $('#audioplayerTabView').removeClass('hidden').html('<div style="text-align:center; word-wrap:break-word;" class="get-metadata"><p><img src="'+OC.imagePath('core','loading.gif')+'"><br><br></p><p>'+t('audioplayer', 'Reading data')+'</p></div>');

    $.ajax({
        type : 'GET',
        url : OC.generateUrl('apps/audioplayer/getaudioinfo'),
        data : {trackid: trackid},
        success : function(jsondata) {
            var html;
            if(jsondata.status === 'success'){

                var edit_array = ['Title', 'Genre', 'Year', 'Artist', 'Disc', 'Track'];
                var table = $('<div>').css('display', 'table').addClass('table');
                var tablerow;
                var m;
                var count = 1;
                var tablekey;
                var tablevalue;

                var audioinfo = jsondata.data;
                for (m in audioinfo) {
                    tablerow = $('<div>').css('display', 'table-row');
                    tablekey = $('<div>').addClass('key').text(t('audioplayer', m));
                    tablevalue = $('<div>').css({'cursor': 'text'})
                        .addClass('value')
                        .text(audioinfo[m]);
                    tablerow.append(tablekey).append(tablevalue);
                    table.append(tablerow);
                    count++;
                }
                $('#sidebarTitle').html(jsondata.data['Title']);
                $('#sidebarMime').html(jsondata.data['MIME type']);

            } else{
                html = t('audioplayer','No Data');
            }

            $('#audioplayerTabView').html(table);
        }
    });
};

Audios.prototype.ID3EditorTabView = function () {
    $('#tabHeaderAudiplayer').removeClass('selected');
    $('#tabHeaderID3Editor').addClass('selected');
    $('#audioplayerTabView').addClass('hidden');
    $('#ID3EditorTabView').removeClass('hidden').html('<div style="text-align:center; word-wrap:break-word;" class="get-metadata"><p>' + t('audioplayer', 'No ID3 Editor installed') + '</p></div>');
};


Audios.prototype.test = function () {
    $('#ID3EditorTabView').html('<div style="text-align:center; word-wrap:break-word;" class="get-metadata"><p><img src="'+OC.imagePath('core','loading.gif')+'"><br><br></p><p>'+t('audioplayer', 'Reading data')+'</p></div>');
    this.$el.html('<div style="text-align:center; word-wrap:break-word;" class="get-metadata"><p><img src="'+OC.imagePath('core','loading.gif')+'"><br><br></p><p>'+t('metadata', 'Reading metadata ...')+'</p></div>');

    if (data.response === 'success') {
        html += '<table>';

        var metadata = data.metadata;
        for (m in metadata) {
            html += '<tr><td class="key">' + m + ':</td><td class="value">' + metadata[m] + '</td></tr>';
        }
    }
};

