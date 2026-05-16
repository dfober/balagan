
SRC    ?= Stages.csv
OUTDIR := docs
IMGS   := $(wildcard src/imgs/*)
DIMGS  := $(IMGS:src/imgs/%=$(OUTDIR)/imgs/%)
CSS    := $(wildcard src/css/*)
DCSS   := $(CSS:src/css/%=$(OUTDIR)/css/%)
DIRS   := $(OUTDIR)/imgs $(OUTDIR)/css
OUT    := $(OUTDIR)/js/stages.js $(OUTDIR)/inscriptions.html  $(OUTDIR)/confirmation.html  $(DIMGS) $(DCSS)


help:
	@echo "Construction de la page inscription"
	@echo "target : all"
	
test:
	echo $(DIMGS)
	
all: $(DIRS) $(OUT)

$(OUTDIR)/js/stages.js : $(SRC) js/stages.js
	node js/csv2html.js  $^ > $@ || rm $@

$(OUTDIR)/inscriptions.html : src/template.html
	cp $< $@

$(OUTDIR)/confirmation.html : src/confirmation.html
	cp $< $@

$(OUTDIR)/imgs/%:  src/imgs/%
	cp $< $@

$(OUTDIR)/css/%:  src/css/%
	cp $< $@

$(DIRS):
	mkdir $@

