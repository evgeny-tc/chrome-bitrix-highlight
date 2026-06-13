BX.ready(function()
{
    window.onkeydown = function( event )
    {
        if ( event.keyCode == 27 )
        {
            if( document.querySelector('textarea[name="execute_code"]') )
            {
                alert("Перехват закрытия окна!");

                return false;
            }
        }
    };

    BX.addCustomEvent("onAjaxSuccessFinish", BX.delegate(function(data)
    {
        if( data.data
            && (data.data.includes('EditorComment') || data.data.includes('activity=CodeActivity') )
            && document.querySelector('textarea[name="execute_code"]') )
        {
            document.querySelector('textarea[name="execute_code"]').id = 'execute_code';

            if (!top.BXCodeEditors)
            {
                top.BXCodeEditors = window.BXCodeEditors = {};
            }

            function codeEditorLoaded()
            {
                let CE = new window.JCCodeEditor(
                    {
                        'id':'bxce-1220',
                        'textareaId':'execute_code',
                        'theme':'dark',
                        'highlightMode':true,
                        'saveSettings':true,
                        'height':'350',
                        'forceSyntax':'php'
                    },
                    {
                        'GoToLine':'Быстрый переход на строку',
                        'Line':'строка',
                        'Char':'символ',
                        'Total':'Всего',
                        'Lines':'строк',
                        'Chars':'символов',
                        'LineTitle':'Текущая строка',
                        'CharTitle':'Текущий символ',
                        'EnableHighlight':'подсветка синтаксиса',
                        'EnableHighlightTitle':'Включить/выключить подсветку синтаксиса',
                        'DarkTheme':'темный фон',
                        'LightTheme':'светлый фон',
                        'HighlightWrongwarning':'В текущем браузере подсветка синтаксиса может работать некорректно.'
                    }
                );

                top.BXCodeEditors['bxce-1220'] = window.BXCodeEditors['bxce-1220'] = CE;

                if( document.querySelector('#execute_code') )
                {
                    document.querySelector('.bxce').style.width = '100%';
                    const element = document.querySelector('#execute_code')
                        ?.parentElement
                        ?.parentElement
                        ?.parentElement
                        ?.parentElement
                        ?.nextElementSibling;

                    if (element) {
                        element.remove();
                    }
                }

                BX.onCustomEvent(window, "OnCodeEditorReady", ['bxce-1220']);
            }

            if ( ! window.JCCodeEditor)
            {
                BX.loadScript('/bitrix/js/fileman/code_editor/code-editor.js', codeEditorLoaded);
                BX.loadCSS('/bitrix/js/fileman/code_editor/code-editor.css');
            }
            else
            {
                codeEditorLoaded();
            }
        }

        if( data.url && data.url.includes('compatible_selector.php' ) )
        {
            const $form = $('.bx-core-adm-dialog-content').last().find('form[name="bx_popup_form"]');

            if (!$form.length) return;

            $('.select-search-container').remove();

            $form.find('select').each(function() {
                const $select = $(this);
                const selectId = $select.attr('id');

                if (!selectId) return;

                let nativeSearchId = selectId.endsWith('S')
                    ? (selectId.includes('-') ? selectId + 'I' : selectId.slice(0, -1) + 'I')
                    : selectId + 'I';

                if ($form.find(`#${nativeSearchId}`).length) return;

                const originalHTML = $select[0].outerHTML;

                $select.before(`
                    <div class="select-search-container" style="margin-bottom: 5px; position: relative;">
                        <input type="text" 
                               class="select-search-input" 
                               placeholder="🔍 Поиск по списку..." 
                               style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>
                `);

                const $searchInput = $select.prev().find('.select-search-input');

                $searchInput.on('input', function() {
                    const searchText = $(this).val().toLowerCase().trim();

                    if (!searchText) {
                        const $newSelect = $(originalHTML);
                        $select.replaceWith($newSelect);
                        return;
                    }

                    $select.find('option').each(function() {
                        const $opt = $(this);
                        const text = $opt.text().toLowerCase();

                        if (text.includes(searchText)) {
                            $opt.show();
                            if ($opt.parent().is('optgroup')) {
                                $opt.parent().show();
                            }
                        } else {
                            $opt.hide();
                        }
                    });

                    $select.find('optgroup').each(function() {
                        const $group = $(this);
                        if ($group.find('option:visible').length === 0) {
                            $group.hide();
                        } else {
                            $group.show();
                        }
                    });

                    if ($select.find('option:visible').length === 0) {
                        if (!$select.next('.no-results').length) {
                            $select.after('<div class="no-results" style="color: red; padding: 5px;">❌ Ничего не найдено</div>');
                        }
                    } else {
                        $select.next('.no-results').remove();
                    }
                });
            });
        }
    }, this));
});