ALTER TABLE modules ADD visibility boolean;
ALTER TABLE topics ADD visibility boolean;
ALTER TABLE contents ADD visibility boolean;

UPDATE modules SET visibility=true;
UPDATE topics SET visibility=true;
UPDATE contents SET visibility=true;