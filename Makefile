.PHONE	: website

website	: index.html style.css Makefile

index.html : index.jade
	jade $<

style.css : style.less
	lessc $< > $@
