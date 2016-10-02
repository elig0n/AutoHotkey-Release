function forEach(arr, fn) {
	var i;
	for (i = 0; i < arr.length; ++i)
		fn.apply(arr[i]);
}
function onload() {
	ci_nav_list.length = 0;
	forEach (ci_nav.getElementsByTagName("a"), function() {
		this.tabIndex = 1000;
		if (this.hash != "") {
			var list = this.parentNode == ci_nav_list ? ci_nav_list : null;
			if (list)
				list[list.length++] = this;
			this.onclick = function() {
				if (list) {
					forEach (list.getElementsByTagName("a"), function() {
						this.className = "";
					})
					this.className = "current";
				}
				event.returnValue = switchPage(this.hash.substr(1));
			}
		}
	})
}
function initOptions(curName, curVer, curType, newVer, instDir, smFolder, defType, is64) {
	if (onload) onload(), onload = null;
	var opt;
	var warn;
	var types = {Unicode: "Unicode 32-bit", ANSI: "ANSI 32-bit", x64: "Unicode 64-bit"};
	var curTypeName = types[curType];
	var defTypeName = types[defType];
	curTypeName = curTypeName ? " (" + curTypeName + ")" : "";
	if (curName == "AutoHotkey" && curVer <= "1.0.48.05") {
		start_intro.innerText = curName + " v" + curVer + " is installed. What do you want to do?";
		var uniType = is64 ? "x64" : "Unicode";
		var uniTypeName = types[uniType];
		opt = [
			"AHK('Upgrade', 'ANSI')", "Upgrade to v" + newVer + " (" + types.ANSI + ")", "Recommended for compatibility.",
			"AHK('Upgrade', '" + uniType + "')", "Upgrade to v" + newVer + " (" + uniTypeName + ")", "",
			"AHK('Customize')", "Custom Installation", ""
		];
		warn = '<strong>Note:</strong> Some AutoHotkey 1.0 scripts are <a href="#" onclick="'+"AHK('ViewHelp', '/docs/Compat.htm'); return false"+'">not compatible</a> with AutoHotkey 1.1.';
	} else if (curName == "") {
		start_intro.innerText = "Please select the type of installation you wish to perform.";
		opt = [
			"AHK('QuickInstall')", "Express Installation", "Default version: " + defTypeName + "<br>Install in: " + instDir,
			"AHK('Customize')", "Custom Installation", ""
		];
	} else if (curVer != newVer) {
		start_intro.innerText = curName + " v" + curVer + curTypeName + " is installed. What do you want to do?";
		opt = [
			"AHK('Upgrade', '" + defType + "')", (curVer < newVer ? "Upgrade" : "Downgrade") + " to v" + newVer + " (" + defTypeName + ")", "",
			"AHK('Customize')", "Custom Installation", ""
		];
	} else {
		start_intro.innerText = curName + " v" + curVer + curTypeName + " is installed. What do you want to do?";
		opt = [
			"AHK('QuickInstall')", "Repair", "",
			"AHK('Customize')", "Modify", "",
			"AHK('Uninstall')", "Uninstall", ""
		];
	}
	var i, html = [];
	for (i = 0; i < opt.length; i += 3) {
		html.push('<a href="#" onclick="', opt[i], '; return false" id="opt', Math.floor(i/3)+1, '"><span>', opt[i+1], '</span>');
		if (opt[i+2])
			html.push('<p>', opt[i+2], '</p>');
		if (opt[i] == "AHK('Customize')")
			html.push('<div class="marker">\u00BB</div>');
		html.push('</a>');
	}
	start_options.innerHTML = html.join("");
	start_warning.innerHTML = warn;
	start_warning.style.display = warn ? "block" : "none";
	start_nav.innerHTML = '<em style="text-align:right;width:100%">version ' + newVer + '</em>';
	installtype.value = defType;
	installdir.value = instDir;
	startmenu.value = smFolder;
	startmenu.onblur();
	forEach (document.getElementsByTagName("a"), function() {
		if (/*this.className == "button" ||*/ this.parentNode.className == "options")
			this.hideFocus = true;
	})
}
document.onselectstart =
document.oncontextmenu =
document.ondragstart =
	function() {
		return window.event && event.srcElement.tagName == "INPUT" || false;
	};
function setInstallType(type) {
	installtype.value = type;
	ci_nav_list[1].click();
	event.returnValue = false;
}
function switchPage(page) {
	page = document.getElementById(page);
	if (page.id == "start")
		ci_nav_list[0].click();
	for (var n = page.parentNode.firstChild; n; n = n.nextSibling) if (n.className == "page") {
		if (n != page)
			n.style.display = "none";
		else
			n.style.display = "block";
	}
	var f;
	switch (page.id) {
	case "custom-install":
	case "ci_version":  f = "it_" + installtype.value; break;
	case "ci_location": f = "next-button"; break;
	case "ci_options":  f = "install_button"; break;
	case "done":        f = "done_exit"; break;
	}
	if (f) {
		// If page == ci_version, it mightn't actually be visible at this point,
		// which causes IE7 (and perhaps older) to throw error 0x80020101.
		try { document.getElementById(f).focus() } catch (ex) { }
	}
	return false;
}
function customInstall() {
	if (startmenu.style.color == '#888')
		startmenu.value = '';
	return AHK('CustomInstall');
}