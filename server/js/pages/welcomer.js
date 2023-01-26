var socket = io();
var current = {
  wc: {},
  gb: {}
}
var changed = {
  wc: {},
  gb: {}
}
var channels = [];
var confirmation = 0;
var prog = 0;
var renderStatus = "rendering";
var Toast;
var activePrefix = '';
socket.emit("getData", null, "channel")
function showAlert(status, title, type) {
  if (type != "confirm") {
    Swal.fire({
      toast: true,
      icon: status || 'error',
      title: title || 'Error',
      position: 'top-end',
      showConfirmButton: false,
      animation: true,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  } else {
    confirmation = 1
    Swal.fire({
      toast: true,
      icon: status,
      title: title,
      position: 'bottom',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: 'Reset'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmation = 0
        save(activePrefix)
      } else if(result.isDismissed) {
        confirmation = 0;
        render(current[activePrefix], activePrefix)
      }
    })
  }
}
function watch(prefix) {
  if (renderStatus === "rendering") return;
  activePrefix = prefix
  changed[prefix] = getData(prefix);
  if(current[prefix].showEmbed === "no" && Object.entries(changed[prefix]["m"]["embeds"]).length ==1) delete changed[prefix]["m"]["embeds"];
  let def = JSON.stringify(current[prefix])
  let dyn = JSON.stringify(changed[prefix])
  if(def === dyn) {
    if(confirmation === 1) {
      Swal?.close()
    }
  } else if(def != dyn) {
    if(confirmation == 0) {
      showAlert('warning', 'You have unsaved changes', 'confirm')
    }
  }
}
function readURL(input, prefix) {
  try {
  if (input.files && input.files[0]) {
    var allowed = ["png","jpg","jpeg","gif","webp"]
    var hasimage = `#${prefix}_hasimage`
    var noimage = `#${prefix}_noimage`
    var name = input.files[0].name
    var ext = name.substr(name.lastIndexOf(".")+1)
    if(!allowed.includes(ext)) return alert(`File harus berekstensi ${allowed.map(ext=>`${ext.toUpperCase()}`).join(", ")}`);
    var reader = new FileReader();
    reader.onload = function (e) {
      const file = {
        name: prefix,
        path: $("body").attr("id")+"/"+prefix,
        type: ext
      }
      $(hasimage).find("img").attr('src', e.target.result);
      $(noimage).addClass("d-none")
      $(hasimage).removeClass("d-none")
      const base64 = getDataUrl(e.target.result);
      socket.emit("uploadImage", base64.data, file, prefix);
    }
    reader.readAsDataURL(input.files[0]);
  }
  } catch (error) {
    alert(error)
  }
}
function getDataUrl(base) {
  let b = base.replace("data:", "").split(";base64,")
  let d = b[1].trim()
  let m = b[0].trim()
  return { data: d, mime: m }
}
function render(data, prefix) {
  try {
  renderStatus = "rendering"
  var defaults = {
    channel : '',
    enable : "no",
    showEmbed : "no",
    m: {}
  }
  var json = {
    channel : '',
    enable : "no",
    showEmbed : "no",
    m: {}
  }
  var obj = !data ? json : Object.assign(defaults, data)
  var channel = channels.filter(c=>c.type == "GUILD_TEXT").map(c=> `<option value="${c.id}">#${c.name}</option>`).join("")
  $(`#${prefix}_channel`).html(channel)
  if(obj.hasOwnProperty("showEmbed")) {
    json.showEmbed = obj.showEmbed
    if (obj.showEmbed === "yes") {
      if(!$(`#${prefix}_enable_embed`).attr("checked")) {
        $(`#${prefix}_enable_embed`).prop('checked', true)
        $(`#${prefix}_enable_embed`).attr('checked', '')
        $(`#${prefix}_embed`).slideDown()
        $(`#${prefix}_show_embed_text`).text("Tampilkan Embed")
      }
    } else if (obj.showEmbed == "no") {
      if($(`#${prefix}_enable_embed`).attr("checked")) {
        $(`#${prefix}_enable_embed`).prop('checked', false)
        $(`#${prefix}_enable_embed`).attr('checked', '')
        $(`#${prefix}_embed`).slideUp()
        $(`#${prefix}_show_embed_text`).text("Tampilkan Embed")
      }
    }
  }
  if(obj.hasOwnProperty("channel")) {
    var currentChannel = obj.channel
    json.channel = obj.channel
   $(`#${prefix}_channel > option`).each((i,e)=>{
     if($(`#${prefix}_channel > option`).eq(i).attr("value") === currentChannel) {
      $(`#${prefix}_channel > option`).eq(i).attr("selected","selected")
     }
   })
  }
  if(obj.hasOwnProperty("enable")) {
    json.enable = obj.enable
    if(obj.enable == "yes") {
      $(`#${prefix}_enable`).prop("checked", true)
      $(`#${prefix}_enable`).attr("checked", "")
      $(`#${prefix}_enable_module`).slideDown()
    } else {
      $(`#${prefix}_enable`).prop("checked", false)
      $(`#${prefix}_enable`).removeAttr("checked")
      $(`#${prefix}_enable_module`).slideUp()
    }
  }
  if(obj.hasOwnProperty("m")) {
    var m = obj.m
    json.m = {}
    if(m.hasOwnProperty("content")) {
      json.m.content = m.content
      $(`#${prefix}_embeds_content`).val(m.content)
    }
    if(m.hasOwnProperty("embeds")) {
      var embeds = m.embeds
      json.m.embeds = {}
      if(embeds.hasOwnProperty("color")) {
        let color = isNaN(parseInt(embeds.color)) ? embeds.color.toUpperCase() : `#${embeds.color.toString(16)}`.toUpperCase()
        json.m.embeds.color = color
        $(`#${prefix}_embeds_color`).val(color)
      }
      if(embeds.hasOwnProperty("title")) {
        json.m.embeds.title = embeds.title
        $(`#${prefix}_embeds_title`).val(embeds.title)
      }
      if(embeds.hasOwnProperty("description")) {
        json.m.embeds.description = embeds.description
        $(`#${prefix}_embeds_description`).val(embeds.description)
      }
      if(embeds.hasOwnProperty("image")) {
        json.m.embeds.image = {url:embeds.image.url}
        let image = embeds.image.url
        $(`#${prefix}_embeds_image`).attr('src', image);
        $(`#${prefix}_hasimage`).removeClass("d-none")
        $(`#${prefix}_noimage`).addClass("d-none")
      }
      if(embeds.hasOwnProperty("footer")) {
        var footer = embeds.footer
        json.m.embeds.footer = {}
        if(footer.text) {
          json.m.embeds.footer.text = footer.text
          $(`#${prefix}_embeds_footer_text`).val(footer.text);
        }
        if(footer.icon_url) {
          json.m.embeds.footer.icon_url = footer.icon_url
          $(`#${prefix}_embeds_footer_icon_url`).val(footer.icon_url);
        }
      }
    }
  }
  if (Object.entries(json.m).length === 0) delete json.m;
  current[prefix] = json;
  $(`#${prefix}_colorpicker`)?.colorpicker()
  $(`#${prefix}_channel`)?.select2({ theme: 'bootstrap-5' })
  renderStatus = prog > 3 ? "done" : "rendering"
  } catch (error) {
    showAlert("error", error)
  }
}
function getData(prefix, callback) {
  var json = {
    channel : '',
    enable : "no",
    showEmbed : "no",
    m : {}
  }
  let showEmbed = $(`#${prefix}_enable_embed`).attr("checked") ? "yes" : "no";
  let enable = $(`#${prefix}_enable`).attr("checked") ? "yes" : "no";
  let channel = $(`#${prefix}_channel`).val()
  let color = $(`#${prefix}_embeds_color`).val()
  let content = $(`#${prefix}_embeds_content`).val()
  let title = $(`#${prefix}_embeds_title`).val()
  let description = $(`#${prefix}_embeds_description`).val()
  let image = !$(`#${prefix}_hasimage`).hasClass("d-none") ? $(`#${prefix}_hasimage`).find("img").attr("data-src") ? $(`#${prefix}_hasimage`).find("img").attr("data-src") : $(`#${prefix}_hasimage`).find("img").attr("src") : null;
  let footer_text = $(`#${prefix}_embeds_footer_text`).val()
  let footer_icon_url = $(`#${prefix}_embeds_footer_icon_url`).val()
  json.showEmbed = showEmbed
  json.enable = enable
  if(channel) json.channel = channel;
  if(content) json.m.content = content;
  json.m.embeds = {}
  if(color) json.m.embeds.color = color;
  if(title) json.m.embeds.title = title;
  if(description) json.m.embeds.description = description;
  if(image) json.m.embeds.image = { url : image };
  if (footer_text) {
    json.m.embeds.footer = {}
    json.m.embeds.footer.text = footer_text;
    if (footer_icon_url) json.m.embeds.footer.icon_url = footer_icon_url;
  }
  if(typeof callback == "undefined") return json;
  return callback(json)
}
function save(prefix) {
  var json = changed[prefix]
  if (Object.entries(json.m).length === 0) delete json.m;
  delete current[prefix];
  current[prefix] = json
  socket.emit("postData", prefix, json)
}
function getPreview(prefix) {
  $(`#${prefix}_editor`).hide()
  $(`#${prefix}_preview`).show()
  getData(prefix, function (data) {
    try {
      if (data.showEmbed === "no" && data.m && data.m.hasOwnProperty("embeds")) delete data.m.embeds;
      const wc_embed = new Embed(`#${prefix}_embeds_preview`)
      wc_embed.updatePreview(data.m)
    } catch (error) {
      console.log(error)
    }
  })
}
// EVENT
$(function() {
  ["wc","gb"].forEach((prefix) => {
    // SWITCH ENABLE MODULE
    $(`#${prefix}_enable`).click(function(e){
      if($(`#${prefix}_enable`).attr("checked")) {
        $(`#${prefix}_enable`).removeAttr("checked")
        $(`#${prefix}_enable_module`).slideUp()
      } else {
        $(`#${prefix}_enable`).attr("checked", "")
        $(`#${prefix}_enable_module`).slideDown()
      }
    })
    // SWITCH ENABLE EMBED
    $(`#${prefix}_enable_embed`).click(function(e){
      if($(`#${prefix}_enable_embed`).attr("checked")) {
        $(`#${prefix}_enable_embed`).removeAttr("checked")
        $(`#${prefix}_embed`).slideUp()
        $(`#${prefix}_show_embed_text`).text("Tampilkan Embed")
      } else {
        $(`#${prefix}_enable_embed`).attr("checked", "")
        $(`#${prefix}_embed`).slideDown()
        $(`#${prefix}_show_embed_text`).text("Sembunyikan Embed")
      }
    })
    // PREVIEW AND SAVE
    $(`#${prefix}_btn_preview`).click(() => getPreview(prefix))
    $(`#${prefix}_btn_back`).click(()=>{
      $(`#${prefix}_preview`).hide()
      $(`#${prefix}_editor`).show()
    })
    // uploader
    $(`#${prefix}_btn_image_upload`).click(() => $(`#${prefix}_imagefile`).click())
    $(`#${prefix}_btn_image_delete`).click(() => {
      $(`#${prefix}_imagefile`).val('')
      $(`#${prefix}_hasimage`).find("img").attr("data-src", "")
      $(`#${prefix}_hasimage`).find("img").attr("src", "")
      $(`#${prefix}_hasimage`).addClass("d-none")
      $(`#${prefix}_noimage`).removeClass("d-none")
      watch(prefix)
    })
    $(`#${prefix}_btn_image_cancel`).click(() => {
      $(`#${prefix}_imagefile`).val('')
      $(`#${prefix}_noimage`).addClass("d-none")
      $(`#${prefix}_hasimage`).removeClass("d-none")
    })
    $(`#${prefix}_imagefile`).change(function () { readURL(this, prefix)})
    
    // WATCH CHANGE
    $(`#${prefix}_enable_embed`).change(() => watch(prefix))
    $(`#${prefix}_enable`).change(() => watch(prefix))
    $(`#${prefix}_channel`).change(() => watch(prefix))
    $(`#${prefix}_embeds_color`).change(() => watch(prefix))
    $(`#${prefix}_embeds_content`).change(() => watch(prefix))
    $(`#${prefix}_embeds_title`).change(() => watch(prefix))
    $(`#${prefix}_embeds_description`).change(() => watch(prefix))
    $(`#${prefix}_embeds_footer_text`).change(() => watch(prefix))
    $(`#${prefix}_embeds_footer_icon_url`).change(() => watch(prefix))
  })
})

// SOCKET
socket.on("getData", (res) => {
  switch (prog) {
    case 0:
      channels = res.data.channel
      socket.emit("getData", "wc", "wc")
      prog = 1;
    case 2:
      socket.emit("getData", "gb", "gb")
      prog = 3;
    default:
      render(res.data.data, res.data.type)
      prog++;
  }
})
socket.on("postData", (res) => {
  if(!res.status) return;
  showAlert(res.status, "Pengaturan berhasil di simpan")
})
socket.on("uploadImage", (res) => {
  if(!res.status) return showAlert(res.status, "Error saat mengunggah gambar.");
  $(`#${res.data.type}_embeds_image`).attr("data-src", res.data.url)
  watch(res.data.type)
})