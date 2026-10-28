# Lamina UI / Lamina Mono

Original typeface software for tenvell, working version0.3. Four faces: UI and Mono, each Regular400 and Medium500. Coverage is246 characters: basic Cyrillic/Russian, Latin/ASCII, digits, punctuation and selected accented Latin. This is not a complete all-language or professionally hinted foundry family.

Contours and spacing are defined in master.py. build.py packages those original outlines with FontTools and Shapely; it does not read another font as a source. Requirements are listed in requirements.txt.

From the repository root, with Python3.11+:

    python3 -m venv typeface/.venv
    typeface/.venv/bin/python -m pip install -r typeface/requirements.txt
    LAMINA_OUT=typeface/proof typeface/.venv/bin/python typeface/build.py

Use a staging output such as typeface/proof when experimenting; compare real Cyrillic/Latin headings and body text before replacing the packaged public/fonts assets. The release embeds the existing0.3 WOFF2 bytes without changing glyphs. The supplied web specimen is /typeface.html.

Lamina font software is distributed under SIL OFL1.1; see FONT-LICENSE.txt. The broader tenvell UI code is MIT licensed. Build-time libraries retain their own licences.
