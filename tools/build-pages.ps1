<#
  Creates one HTML page per paper (pub/<id>.html) and per research topic
  (research/<slug>.html) from data/publications.js and data/topics.js.

  Run it after adding a paper or topic:
      powershell -ExecutionPolicy Bypass -File tools\build-pages.ps1

  The pages are small shells; their content is rendered from the data files,
  so editing a paper's text never needs a rebuild. Only new ids/slugs do.
#>
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$dot = [string][char]0x00B7
$copy = [string][char]0x00A9

function HtmlEsc([string]$s) {
  return $s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;")
}

function Shell([string]$title, [string]$desc, [string]$bodyAttrs, [string]$mainId, [string[]]$scripts) {
  $t = HtmlEsc $title
  $d = HtmlEsc $desc
  $tags = ($scripts | ForEach-Object { "<script src=""../$_""></script>" }) -join "`n"
  return @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$t $dot Kim Q. Tran</title>
  <meta name="description" content="$d">
  <meta property="og:title" content="$t">
  <meta property="og:description" content="$d">
  <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script>try { var t = localStorage.getItem("theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) {}</script>
</head>
<body data-base="../" $bodyAttrs>
<a class="skip" href="#$mainId">Skip to content</a>
<header class="topbar">
  <div class="topbar-inner">
    <a class="brand" href="../index.html">Kim Q. Tran</a>
    <nav class="nav" aria-label="Site">
      <a href="../index.html#about">About</a>
      <a href="../index.html#keywords">Keywords</a>
      <a href="../index.html#publications">Publications</a>
      <a href="../index.html#code">Code</a>
      <a href="../index.html#references">References</a>
    </nav>
    <button class="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">
      <svg class="ico ico-sun" aria-hidden="true"><use href="#i-sun"/></svg>
      <svg class="ico ico-moon" aria-hidden="true"><use href="#i-moon"/></svg>
    </button>
  </div>
</header>
<main class="page" id="$mainId">
  <h1 class="page-title">$t</h1>
  <noscript><p>$d</p><p><a href="../index.html">Back to the home page</a></p></noscript>
</main>
<footer class="page" style="padding-top:0;padding-bottom:40px"><div class="footer"><p>$copy <span id="year">2026</span> Kim Q. Tran $dot <a href="../index.html">Home</a></p></div></footer>
$tags
</body>
</html>
"@
}

$pubsJs = [IO.File]::ReadAllText((Join-Path $root "data\publications.js"), [Text.Encoding]::UTF8)
$topicsJs = [IO.File]::ReadAllText((Join-Path $root "data\topics.js"), [Text.Encoding]::UTF8)
$data = @("data/site.js", "data/topics.js", "data/publications.js", "assets/js/common.js")

# --- papers ---
$pubDir = Join-Path $root "pub"
New-Item -ItemType Directory -Force $pubDir | Out-Null
$ids = [regex]::Matches($pubsJs, '(?s)\bid:\s*"([^"]+)".*?\btitle:\s*"((?:[^"\\]|\\.)*)".*?\bsummary:\s*"((?:[^"\\]|\\.)*)"')
foreach ($m in $ids) {
  $id = $m.Groups[1].Value; $title = $m.Groups[2].Value; $summary = $m.Groups[3].Value
  $html = Shell $title $summary "data-id=""$id""" "paper" ($data + "assets/js/paper.js")
  [IO.File]::WriteAllText((Join-Path $pubDir "$id.html"), $html, $utf8)
}
"papers: $($ids.Count) pages in pub/"

# --- topics ---
$resDir = Join-Path $root "research"
New-Item -ItemType Directory -Force $resDir | Out-Null
$tops = [regex]::Matches($topicsJs, '(?s)\bslug:\s*"([^"]+)".*?\bname:\s*"([^"]+)".*?\bshort:\s*"([^"]+)"')
foreach ($m in $tops) {
  $slug = $m.Groups[1].Value; $name = $m.Groups[2].Value; $short = $m.Groups[3].Value
  $html = Shell $name $short "data-topic=""$slug""" "topic" ($data + "assets/js/viz.js" + "assets/js/topic.js")
  [IO.File]::WriteAllText((Join-Path $resDir "$slug.html"), $html, $utf8)
}
"topics: $($tops.Count) pages in research/"
