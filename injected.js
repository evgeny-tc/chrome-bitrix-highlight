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
        if( data.data && data.data.includes('EditorComment') && document.querySelector('textarea[name="execute_code"]') )
        {
            document.querySelector('textarea[name="execute_code"]').id = 'execute_code';

            if (!top.BXCodeEditors)
            {
                top.BXCodeEditors = window.BXCodeEditors = {};
            }

            function codeEditorLoaded()
            {
                let CE = new window.JCCodeEditor({'id':'bxce-1220','textareaId':'execute_code','theme':'dark','highlightMode':true,'saveSettings':true,'height':'350','forceSyntax':'php'}, {'GoToLine':'Быстрый переход на строку','Line':'строка','Char':'символ','Total':'Всего','Lines':'строк','Chars':'символов','LineTitle':'Текущая строка','CharTitle':'Текущий символ','EnableHighlight':'подсветка синтаксиса','EnableHighlightTitle':'Включить/выключить подсветку синтаксиса','DarkTheme':'темный фон','LightTheme':'светлый фон','HighlightWrongwarning':'В текущем браузере подсветка синтаксиса может работать некорректно.'});

                top.BXCodeEditors['bxce-1220'] = window.BXCodeEditors['bxce-1220'] = CE;

                BX.onCustomEvent(window, "OnCodeEditorReady", ['bxce-1220']);
            }

            if (!window.JCCodeEditor)
            {
                BX.loadScript('/bitrix/js/fileman/code_editor/code-editor.js', codeEditorLoaded);
                BX.loadCSS('/bitrix/js/fileman/code_editor/code-editor.css');
            }
            else
            {
                codeEditorLoaded();
            }

        }
    }, this));
});