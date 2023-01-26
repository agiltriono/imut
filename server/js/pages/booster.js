var socket = io();
var current = {};
var changed = {};
var channels = [];
var roles = [];
var prog = 0;
var confirmation = 0;
var status = "rendering";
socket.emit("getData", null, "channel");
function render(data) {
  status = "rendering"
  var defaults = {
    booster_role: '',
    channel: '',
    content: {},
    show: 'content',
    enable: false,
    ex_booster_role: ''
  }
  var json = {
    booster_role: '',
    channel: '',
    content: {},
    show: 'content',
    enable: false,
    ex_booster_role: ''
  }
  let obj = data ? Object.assign(defaults, data) : defaults
  var channel = channels.filter(c=>c.type == "GUILD_TEXT").map(c=> `<option value="${c.id}">#${c.name}</option>`).join('')
  var guildRoles = [...roles.filter(r=>r.name != "@everyone")]
  guildRoles.sort((a,b) => b.position - a.position)
  var role = guildRoles.map(r=> `<option value="${r.id}" data-color="${parseColor(r.color)}">@${r.name}</option>`).join("")
  $("#booster_channel").html(channel)
  $("#booster_role").html(role)
  $("#booster_ex_role").html(role)
  if(obj.hasOwnProperty("show")) {
    json.show = obj.show
    if (obj.show === "content") {
      $("#booster_enable_message").prop('checked', true)
      $("#booster_enable_message").attr('checked', '')
      $("#booster_enable_embed").prop('checked', false)
      $("#booster_enable_embed").removeAttr('checked')
      $("#booster_embed").hide()
      $("#booster_message").show()
    } else if (obj.show === "embed"){
      $("#booster_enable_embed").prop('checked', true)
      $("#booster_enable_embed").attr('checked', '')
      $("#booster_enable_message").prop('checked', false)
      $("#booster_enable_message").removeAttr('checked')
      $("#booster_message").hide()
      $("#booster_embed").show()
    }
  }
  if(obj.hasOwnProperty("channel")) {
    json.channel = obj.channel
   $("#booster_channel > option").each((i,e)=>{
     if($("#booster_channel > option").eq(i).attr("value") === obj.channel) {
      $("#booster_channel > option").eq(i).attr("selected","selected")
     } else {
       $("#booster_channel > option").eq(i).removeAttr("selected")
     }
   })
  }
  if(obj.hasOwnProperty("booster_role")) {
    json.booster_role = obj.booster_role
   $("#booster_role > option").each((i,e)=>{
     if($("#booster_role > option").eq(i).attr("value") === obj.booster_role) {
      $("#booster_role > option").eq(i).attr("selected","selected")
     } else {
       $("#booster_role > option").eq(i).removeAttr("selected")
     }
   })
  }
  if(obj.hasOwnProperty("ex_booster_role")) {
    json.ex_booster_role = obj.ex_booster_role
   $("#booster_ex_role > option").each((i,e)=>{
     if($("#booster_ex_role > option").eq(i).attr("value") === obj.ex_booster_role) {
       $("#booster_ex_role > option").eq(i).attr("selected","selected")
     } else {
       $("#booster_ex_role > option").eq(i).removeAttr("selected")
     }
   })
  }
  if(obj.hasOwnProperty("enable")) {
    let enable = obj.enable == true ? true : false
    json.enable = enable
    if(enable == true) {
      $("#booster_enable").prop("checked", enable)
      $("#booster_enable").attr("checked", "")
      $("#booster_enable_module").slideDown()
    } else {
      $("#booster_enable").prop("checked", enable)
      $("#booster_enable").removeAttr("checked")
      $("#booster_enable_module").slideUp()
    }
  }
  if(obj.hasOwnProperty("content")) {
    var content = obj.content
    json.content = {}
    if(content.hasOwnProperty("content")) {
      json.content.content = content.content
      $("#booster_embeds_content").val(content.content)
      $("#booster_message_content").val(content.content)
    }
    if(content.hasOwnProperty("embeds")) {
      var embeds = content.embeds[0] || content.embeds
      json.content.embeds = {}
      if(embeds.hasOwnProperty("color")) {
        let color = isNaN(parseInt(embeds.color)) ? embeds.color.toUpperCase() : `#${embeds.color.toString(16)}`.toUpperCase()
        json.content.embeds.color = color
        $("#booster_embeds_color").val(color)
      }
      if(embeds.hasOwnProperty("title")) {
        json.content.embeds.title = embeds.title
        $("#booster_embeds_title").val(embeds.title)
      }
      if (embeds.hasOwnProperty("thumbnail")) {
        let thumbnail = embeds.thumbnail.url
        json.content.embeds.thumbnail = {url:thumbnail}
        $("#booster_embeds_thumbnail").attr('src', thumbnail);
        $("#booster_embeds_thumbnail").attr('data-src', thumbnail);
        $("#booster_hasthumbnail").removeClass("d-none")
        $("#booster_nothumbnail").addClass("d-none")
      }
      if(embeds.hasOwnProperty("description")) {
        json.content.embeds.description = embeds.description
        $("#booster_embeds_description").val(embeds.description)
      }
      if (embeds.hasOwnProperty("image")) {
        json.content.embeds.image = {url:embeds.image.url}
        let image = embeds.image.url
        $("#booster_embeds_image").attr('src', image);
        $("#booster_embeds_image").attr('data-src', image);
        $("#booster_hasimage").removeClass("d-none")
        $("#booster_noimage").addClass("d-none")
      }
      if(embeds.hasOwnProperty("footer")) {
        var footer = embeds.footer
        json.content.embeds.footer = {}
        if(footer.text) {
          json.content.embeds.footer.text = footer.text
          $("#booster_embeds_footer_text").val(footer.text);
        }
        if(footer.icon_url) {
          json.content.embeds.footer.icon_url = footer.icon_url
          $("#booster_embeds_footer_icon_url").val(footer.icon_url);
        }
      }
    }
  }
  if (Object.entries(json.content).length === 0) delete json.content;
  current = json;
  $("#booster_colorpicker")?.colorpicker()
  $("#booster_channel")?.select2({ 
    theme: 'bootstrap-5',
    templateResult: selectState,
    templateSelection: selectState
  })
  $("#booster_role")?.select2({ 
    theme: 'bootstrap-5',
    templateResult: selectState,
    templateSelection: selectState
  })
  $("#booster_ex_role")?.select2({ 
    theme: 'bootstrap-5',
    templateResult: selectState,
    templateSelection: selectState
  })
  status = "done";
};
function showAlert(icon, title, recursive) {
  if(!recursive) {
    Swal.fire({
      toast: true,
      icon: icon || 'error',
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
      icon: icon || "warning",
      title: title,
      position: 'bottom',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: 'Reset'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmation = 0
        save()
      } else if(result.isDismissed) {
        confirmation = 0;
        status = "rendering"
        reInput()
        render(current)
      }
    })
  }
};
function parseColor(color) {
  return isNaN(parseInt(color)) ? color.includes("#") ? color.toUpperCase() : "#"+color.toUpperCase() : "#"+color.toString(16).padStart(6, '0').toUpperCase();
};
function selectState(state) {
  const option = $(state.element);
  const color = option.data("color");
  if (!color) {
    return $(`<span style="font-weight:bold;">${state.text}</span>`)
  }
  return $(`<span style="font-weight:bold;color: ${color}">${state.text}</span>`);
};
function readURL(input, prefix) {
  try {
    if (input.files && input.files[0]) {
      var allowed = ["png","jpg","jpeg","gif","webp"]
      var hasimage = $(`#booster_has${prefix}`)
      var noimage = $(`#booster_no${prefix}`)
      var image = $(`#booster_embeds_${prefix}`)
      var name = input.files[0].name
      var ext = name.substr(name.lastIndexOf(".")+1)
      if(!allowed.includes(ext)) return alert(`File harus berekstensi ${allowed.map(ext=>`${ext.toUpperCase()}`).join(", ")}`);
      var reader = new FileReader();
      reader.onload = function (e) {
        const file = {
          name: prefix,
          path: $("body").attr("id")+"/"+"booster_"+prefix,
          type: ext
        }
        image.attr('src', e.target.result);
        noimage.addClass("d-none")
        hasimage.removeClass("d-none")
        const base64 = getDataUrl(e.target.result);
        socket.emit("uploadImage", base64.data, file, prefix);
      }
      reader.readAsDataURL(input.files[0]);
    }
  } catch (error) {
    alert(error)
  }
};
function getDataUrl(base) {
  let b = base.replace("data:", "").split(";base64,")
  let m = b[0].trim()
  let d = b[1].trim()
  return { data: d, mime: m }
};
function resolve(path, obj) {
  return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj)
};
function watch(name) {
  if(status != "done") return;
  changed = getData();
  var def = resolve(name, current)
  var dyn = resolve(name, changed)
  if(def === dyn && def != undefined && dyn != undefined) {
    if (confirmation != 1) return;
    Swal.close()
  } else if(def != dyn) {
    if (confirmation != 0) return;
    showAlert("warning", "Kamu memiliki perubahan yang belum di simpan!", true)
  }
};
function reInput() {
  $("#booster_editor").find("input").each(function(element){
    $(this).val('')
  })
  $("#booster_editor").find("textarea").each(function(element){
    $(this).val('')
  })
}
function getData(callback) {
  var json = {
    booster_role: '',
    channel: '',
    content: {},
    show: 'content',
    enable: false,
    ex_booster_role: ''
  }
  let show = $("[name='show']:checked").val();
  let enable = $("#booster_enable").attr("checked") ? true : false;
  let channel = $("#booster_channel").val()
  let booster_role = $("#booster_role").val()
  let ex_booster_role = $("#booster_ex_role").val()
  let color = $("#booster_embeds_color").val()
  let content = show == "content" ? $("#booster_message_content").val() : $("#booster_embeds_content").val()
  let title = $("#booster_embeds_title").val()
  let description = $("#booster_embeds_description").val()
  let thumbnail = !$("#booster_hasthumbnail").hasClass("d-none") ? $("#booster_embeds_thumbnail").attr("data-src") ? $("#booster_embeds_thumbnail").attr("data-src") : $("#booster_embeds_thumbnail").attr("src") : null;
  let image = !$("#booster_hasimage").hasClass("d-none") ? $("#booster_embeds_image").attr("data-src") ? $("#booster_embeds_image").attr("data-src") : $("#booster_embeds_image").attr("src") : null;
  let footer_text = $("#booster_embeds_footer_text").val()
  let footer_icon_url = $("#booster_embeds_footer_icon_url").val()
  json.show = show
  json.enable = enable
  json.content.embeds = {}
  if(channel) json.channel = channel;
  if(booster_role) json.booster_role = booster_role;
  if(ex_booster_role) json.ex_booster_role = ex_booster_role;
  if(content) json.content.content = content;
  if(color) json.content.embeds.color = color;
  if(title) json.content.embeds.title = title;
  if(thumbnail) json.content.embeds.thumbnail = { url: thumbnail };
  if(description) json.content.embeds.description = description;
  if(image) json.content.embeds.image = { url : image };
  if (footer_text) {
    json.content.embeds.footer = {}
    json.content.embeds.footer.text = footer_text;
    if (footer_icon_url) json.content.embeds.footer.icon_url = footer_icon_url;
  }
  if (json.hasOwnProperty("content")) {
    if (json.content.hasOwnProperty("content")) {
      if(json.content.content.trim().length === 0) delete json.content.content;
    }
    if(json.content.hasOwnProperty("embeds")) {
      let embeds = json.content.embeds
      if (Object.entries(embeds).length == 0) delete json.content.embeds;
    }
  }
  if (Object.entries(json.content).length === 0) delete json.content;
  if(typeof callback == "undefined") return json;
  return callback(json);
};
function save() {
  var obj = getData()
  changed = obj;
  current = obj;
  socket.emit("postData", "booster", changed)
};
function getPreview() {
  try {
    getData(function (data) {
      if (data.show === "content") {
        if (data.hasOwnProperty("content")) {
          if (data.content.hasOwnProperty("embeds")) {
            delete data.content.embeds;
          }
        }
      }
      var embed = new Embed("#booster_embeds_preview")
      $("#booster_editor").hide()
      $("#booster_preview").show()
      embed.updatePreview(data.content)
    })
  } catch (error) {
    showAlert("error", error)
  }
};

// EVENT
$(function() {
  $("#booster_enable").click(()=> {
    if($("#booster_enable").attr("checked")) {
      $("#booster_enable").removeAttr("checked")
      $("#booster_enable_module").slideUp()
    } else {
      $("#booster_enable").attr("checked", "")
      $("#booster_enable_module").slideDown()
    }
  })
  $("#booster_btn_preview").click(() => getPreview())
  $("#booster_btn_back").click(()=>{
    $("#booster_preview").hide()
    $("#booster_editor").show()
  })
  // SWITCH EMBED
  $(`#booster_enable_message`).click(function (e) {
    $(this).val("content")
    $(this).prop('checked', true)
    $(this).attr('checked', '')
    $("#booster_message_content").val($("#booster_embeds_content").val())
    $("#booster_enable_embed").prop('checked', false)
    $("#booster_enable_embed").removeAttr('checked')
    $("#booster_embed").hide()
    $("#booster_message").show()
  })
  $("#booster_enable_embed").click(function(e) {
    $(this).val("embed")
    $(this).prop('checked', true)
    $(this).attr('checked', '')
    $("#booster_embeds_content").val($("#booster_message_content").val())
    $("#booster_enable_message").prop('checked', false)
    $("#booster_enable_message").removeAttr('checked')
    $("#booster_message").hide()
    $("#booster_embed").show()
  })
});
$(function() {
  $("#booster_editor").find("*[name]").each(function (element, index) {
    $(this).change(() => watch($(this).attr('name')))
  })
});
$(function() {
  ["thumbnail", "image"].forEach(function(prefix) {
    $(`#booster_btn_${prefix}_upload`).click(() => $(`#booster_${prefix}_file`).click())
    $(`#booster_btn_${prefix}_delete`).click(() => {
      $(`#booster_${prefix}_file`).val('')
      $(`#booster_has${prefix}`).find("img").removeAttr("data-src")
      $(`#booster_has${prefix}`).find("img").attr("src", "")
      $(`#booster_has${prefix}`).addClass("d-none")
      $(`#booster_no${prefix}`).removeClass("d-none")
    })
    $(`#booster_btn_${prefix}_cancel`).click(() => {
      $(`#booster_${prefix}_file`).val('')
      $(`#booster_no${prefix}`).addClass("d-none")
      $(`#booster_has${prefix}`).removeClass("d-none")
    })
    $(`#booster_${prefix}_file`).change(function () { readURL(this, prefix)})
  });
});
socket.on("getData", (res) => {
  if (!res.status) return;
  if (!res.data) return;
  switch (res.data.type) {
    case 'channel':
      channels = res.data.channel
      socket.emit("getData", null, "role")
      break;
    case 'role':
      roles = res.data.role
      socket.emit("getData", "booster", "booster")
      break;
    case 'booster':
      render(res.data.data)
      break;
  }
});
socket.on("postData", (res) => {
  if(!res.status) return;
  current = changed
  changed = {}
  showAlert(res.status, "Perubahan tersimpan.")
  // DO NOT REMOVE
});
socket.on("uploadImage", (res) => {
  if(!res.status) return;
  if(!res.data) return;
  var image = $(`#booster_embeds_${res.data.type}`)
  image.attr("data-src", res.data.url)
  watch(image.attr("name"))
});