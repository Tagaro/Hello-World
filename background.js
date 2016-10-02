/* -------------------- Globals -------------------- */

var browser;
var sheetRes = "";
var start = 1;
var re_data = "start";
var Account = "Chakora";

if (navigator.appName == "Microsoft Internet Explorer") browser = "ie";
if (navigator.appName == "Netscape") browser = "moz";

var Chars ="";
var CurChar = "";
var CurLeague = "";
var Cur = 0;
var call = 0;
var CharData = 
{
  "CharsNum":0,
  "Chars":
  [
    {
      "League":"",
      "Name":"",
      "Info":
      {
        "AscendancyClass":"",
        "ClassId":"",
        "Class":"",
        "Level":0,
        "Inventory":
        {
          "Gear":[],
          "MainInventory":[]
        },
        "Stash":
        {
          "NumTabs":0,
          "Tabs":
          {
            "id":"",
            "Text":"",
            "Color":
            {
              "R":0,
              "G":0,
              "B":0
            },
            "Image":
            {
              "Use":0,
              "L":"",
              "C":"",
              "R":""
            }
          }
        }
      }
    }
  ]
};
          
var Characters = CharData;
var MenuData = ["Char","Inventory","Stash","Tree"];
var CharInv = "";
var CharStash = "";
var stashCall = 0;
var tabSelect = 1;

/* ----------- REM Addon Button - Open Page Action ----------- */

function openPage()
{
  chrome.tabs.create(
  {
    url: "https://tagaro.github.io/Resource-Manager/rem.htm"
  });
}

/* ------------------------ Get Data ------------------------- */

function GetData(request)
{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", request, true);
  
  xhr.onreadystatechange = function()
  {
    if (xhr.readyState == 4 && xhr.status == 200)
    {
      re_data = JSON.parse(xhr.responseText);
      Main();
    }
  }
  xhr.send();
}

/* ----------------------- Main() ----------------------- */

function Main()
{
  if (re_data != 0 && re_data != undefined)
  {
    if (re_data == "start")
    {
      re_data = "";
    }
    if (call >= 0 && call <= 3)
    {
      InitPage();
    }
  }
}

/* ------------------------ Init Page ------------------------ */

function InitPage()
{
  switch(call)
  {
    case 0:
    {
      RequestData();
      call = 1;
      break;
    }
    case 1:
    {
      Chars = re_data;
      Cur = 1;
      CurChar = Chars[Cur].name;
      CurLeague = Chars[Cur].league;
      RequestData(1,Chars[1]);
      call = 2;
      break;
    }
    case 2:
    {
      CharInv = re_data;
      RequestData(2);
      call = 3;
      break;
    }
    case 3:
    {
      CharacterData();
      CharacterInventory();
      ControlPanel("Menu");
      call = 4;
      break;
    }
    case 4:
    {
      /*charStash = re_data;
      CharacterStashTabs();
      StashGemColorProperty(); */
      break;
    }
  }
}

/* --------------------- RequestData() ---------------------- */

function RequestData(reqX)
{
  var Parameters = "";
  var API_URL = "";
  var API_data = "";
  
  switch(reqX)
  {
    case 1:
      API_URL = "https://www.pathofexile.com/character-window/get-items";
      Parameters = "character=" + CurChar +"&accountName=" + Account;
      break;
    
    case 2:
      var League = "league=" + Chars[Cur].league;
      
      if (stashCall)
      {
        var Tabs = "&tabs=1";
        var TabIndex = "&tabindex=1";
      }
      else
      {
        var Tabs = "&tabs=0";
        var TabIndex = "&tabindex=1" + tabSelect;
      }
      API_URL = "https://www.pathofexile.com/character-window/get-stash-items";
      
      Parameters = League + Tabs + TabIndex + "character=" + CurChar +"&accountName=" + Account;
      break;
    
    default:
    API_URL = "https://www.pathofexile.com/character-window/get-characters";
    Parameters = "accountName=" + Account;
  }
  API_data = API_URL + "?" + Parameters;
  GetData(API_data);
}

/* --------------------- Character Data ---------------------- */

function CharacterData()
{
  CharData.CharsNum = Chars.length;
  
  for(var i = 0;i < Chars.length;i++)
  {
    if (!CharData.Chars[i])
    {
      CharData.Chars[i] = Characters;
    }
    CharData.Chars[i].League = Chars[i].league;
    CharData.Chars[i].Name = Chars[i].name;
    CharData.Chars[i].AscendancyClass = Chars[i].ascendancyClass;
    CharData.Chars[i].ClassId = Chars[i].classId;
    CharData.Chars[i].Class = Chars[i]["class"];
    CharData.Chars[i].Level = Chars[i].level;
  }
}

/* ------------------ Character Inventory ------------------- */

var CII = "";
var Item = "";
var StashItems = "";

function CharacterInventory()
{
  CII = CharInv.items;
  CharData.Chars[Cur].Gear = [];
  CharData.Chars[Cur].MainInventory = [];
  
  for(var i = 0;i < CII.length;i++)
  {
    Item = CII[i].inventoryId;
    
    if (Item != "MainInventory")
    {
      if (Item == "Flask")
      {
        Item = Item + (CII[i].x + 1);
      }
      CharData.Chars[Cur].Gear[Item] = CII[i];
    }
    else
    {
      Item = CII[i].typeLine;
      
      CharData.Chars[Cur].MainInventory[Item] = CII[i];
    }
  }
}

/* -------------------- CharacterStashTabs ---------------------- */

/* function CharacterStashTabs()
{
  var StashTabs = Char.League[CurLeague].Name[CurChar].Stash.Tabs
  var NstashTabs = CharStash.numTabs;
  var ImgIndex = [];
  var image = 1;
  var ref = 1;
  
  ImgIndex[ref] = i;
  Char.League[CurLeague].Name[CurChar].Stash.NumTabs = CharStash.numTabs;
  
  for(var i = 1;i < NstashTabs;I++)
  {
    StashTabs[i].id = CharStash.tabs[i].id;
    StashTabs[i].Text = CharStash.tabs[i].n;
    StashTabs[i].Color = CharStash.tabs[i].colour;
    
    if (i > 1)
    {
      for(var j = 1;j <= ImgIndex.length;j++)
      {
        if (CharStash.tabs[i].srcL == StashTabs[ImgIndex[j]].Image.L)
        {
          StashTabs[i].Use = ImgIndex[j];
          StashTabs[i].Image.L = "";
          StashTabs[i].Image.C = "";
          StashTabs[i].Image.R = "";
          break;
        }
        if (j == ImgIndex.length && CharStash.tabs[i].srcL == undefined)
        {
          StashTabs[i].Image.L = CharStash.tabs[i].srcL;
          StashTabs[i].Image.C = CharStash.tabs[i].srcC;
          StashTabs[i].Image.R = CharStash.tabs[i].srcR;
        }
      }
    }
  }
} /*
/* Char.Stash = {"NumTabs":"","Tabs":{"id":"","Text":[],"Color":[],"Image":[]}};
   Char.Stash.Tabs.Image {"L":"","C":"","R":""; */

/* ----------------------- SameName() ----------------------- */

function SameName(Name)
{
  var Count = "";
  
  if (Count[Name] == undefined)
  {
    Count[Name] = 2;
  }
  else Count[Name]++;
  
  Name += Count[Name];

  return Name;
}

/* -------------------- InventoryPanel() -------------------- */

function InventoryPanel()
{
  Code = "";
  var ImgStart = "<img alt='' src='";
  var ImgWSMini = "' style='width: 35.0262px; height: 69px;'>"; /*top: 6px; left: 5.98335px */
  var ImgWeapon1 = "";
  var ImgWeapon2 = "";
  var ImgHelm = "";
  var ImgAmulet = "";
  var ImgRing1 = "";
  var ImgRing2 = "";
  var ImgChest = "";
  var ImgArms = "";
  var ImgBelt = "";
  var ImgFootgear
  var ImgFlask1 = "";
  var ImgFlask2 = "";
  var ImgFlask3 = "";
  var ImgFlask4 = "";
  var ImgFlask5 = "";
}

/* ----------------------- WepSwap() ------------------------- */

function WepSwap()
{
  var WSD_None = "display: none;";
  var WSD_Block = "display: block;";
  var WepClass = document.querySelectorAll("[class*=weaponSwap]");
  var WC;
  
  for(var i = 0;i < WepClass.length - 1;i++)
  {
    WC = WepClass[i];
    
    if (WC.style == WSD_Block)  WC.style = WSD_None;
    else WC.style = WSD_Block;
  }
}

/* -------------------- ControlPanel() --------------------- */

function ControlPanel(Setup)
{
  chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
    title: "Resource Manager"
  },
  function(tabs)
  {
    if (Setup == "Menu")
    {
      chrome.tabs.sendMessage(tabs[0].id,
      {
        Panel: "Menu",
        Chars: CharData.Chars
      });
    }
    if (Setup == "Inventory")
    {
      chrome.tabs.sendMessage(tabs[0].id,
      {
        Panel: "Inventory",
        Gear: CharData.Chars.Gear,
        Inventory: CharData.Chars.MainInventory
      });
    }
  });
}

/* ---------------------- MouseActions() ---------------------- */

function MouseActions(mouseEvent)
{
  var curId = mouseEvent.target.id;
  var cur = curId.slice(4);
  
  if (cur >= 0 && cur <= 2)
  {
    CurChar = Chars[cur].Name;
    RequestData(1);
    InitPage(2,"Change");
  }    
}

/* ------------------------- NChar() ------------------------- */

function NChar(Cnum,CChar)
{
  return Array(Cnum + 1).join(CChar);
}

/* ------------------------- XCopy() ------------------------ */

function XCopy(Orig,nCopy)
{
	var nCopyN = nCopy || {};
	var OrigE = [];
	var OrigKeys = Object.keys(Orig);
	
	for(var i = 0;i < OrigKeys.length;i++)
	{
		OrigE = Orig[OrigKeys[i]];
		
		if (typeof  OrigE === Object)
		{
			if (OrigE.constructor === Array)
			{
				nCopyN = [];
			}
			else nCopyN = {};
			
			XCopy(OrigE,nCopyN);
		}
		else nCopyN[OrigKeys[i]] = OrigE;
	}
	return nCopyN;
}

/* ----------------- Modify_page Comm Port ------------------ */

var portFromCS;

function PortMessage(p)
{
  portFromCS = p;
  
  portFromCS.onMessage.addListener(function(r)
  {
    chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
      title: "Resource Manager"
    },
    function(tabs)
    {
      if (tabs[0] && tabs[0].title == "Resource Manager")
      {
        portFromCS.postMessage({Message: "Correct page"});
        RequestData(0);
      }
    });
  });
}

chrome.runtime.onConnect.addListener(PortMessage);
chrome.browserAction.onClicked.addListener(openPage);
