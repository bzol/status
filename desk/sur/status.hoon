|%
+$  ship      @p
+$  location  @ta
+$  note      @ta
+$  activity  ?(%off %nodisturb %meetme %working)
+$  status    [=location =note =activity]

+$  mystatus  [=location =note =activity]
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
