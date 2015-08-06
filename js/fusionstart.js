  window.addEvent('load', function() {
				new JCaption('img.caption');
			});
			window.addEvent('domready', function() {
				var modules = ['rt-block'];
				var header = ['h3','h2:not(.itemTitle)','h1'];
				GantryBuildSpans(modules, header);
			});
		
            window.addEvent('domready', function() {
                new Fusion('ul.menutop', {
                    pill: 0,
                    effect: 'slide and fade',
                    opacity:  1,
                    hideDelay:  500,
                    centered:  0,
                    tweakInitial: {'x': -10, 'y': -13},
                    tweakSubsequent: {'x':  0, 'y':  0},
                    tweakSizes: {'width': 20, 'height': 20},
                    menuFx: {duration:  300, transition: Fx.Transitions.Back.easeInOut},
                    pillFx: {duration:  400, transition: Fx.Transitions.Back.easeOut}
                });
            });
