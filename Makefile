
SRC    ?= Stages.csv
OUTDIR := docs
OUT := $(OUTDIR)/js/stages.js $(OUTDIR)/inscriptions.html

help:
	@echo "Construction de la page inscription"
	@echo "target : all"
	

all: $(OUT)

$(OUTDIR)/js/stages.js : $(SRC) js/stages.js
	node js/csv2html.js  $^ > $@ || rm $@

$(OUTDIR)/inscriptions.html : rsrc/template.html
	cp $< $@
