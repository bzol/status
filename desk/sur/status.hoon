|%
+$  ship      @p
+$  location  @ta
+$  note      @ta
+$  availability  ?(%off %nodisturb %meetme)
:: +$  availability  @ta
+$  status    [=location =note =availability]

+$  mystatus  [=location =note =availability]
+$  paldata  (map ship status)

+$  action
  $%
    [%set-status =status]
  == 
+$  update
  $%
    [%update =ship =status]
  ==
--
