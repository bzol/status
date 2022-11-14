/-  status, pals
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  leeches  (set @p)
+$  targets  (set @p)
+$  state-0  [%0 =mystatus:status =paldata:status =leeches =targets]
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
::
++  on-init
  ^-  (quip card _this)
  :_  this(mystatus ['' '' 'off'])
  :~
      [%pass /targets %agent [our.bowl %pals] %watch /targets]
      [%pass /leeches %agent [our.bowl %pals] %watch /leeches]
  ==
::
++  on-save
  ^-  vase
  !>(state)
::

++  on-load  
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
    %0  `this(state old)
  ==
::
++  on-poke   
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+    mark  (on-poke:def mark vase)
      %status-action
    =/  action  !<(action:status vase)
    ?-   -.action
      %set-status  
    :_  this(mystatus +.action)
    [%give %fact ~[/updates] %status-update !>(`update:status`[%update our.bowl +.action])]~
    ==
  ==
++  on-watch  
  |=  =path
  ^-  (quip card _this)
  ?+    path  (on-watch:def path)
      [%updates ~]
    :: TODO Authorization
    :: ?>  (~(has in friends) src.bowl)
    ~&  'on-watch-happened'
    :_  this
    [%give %fact ~[/updates] %status-update !>(`update:status`[%update our.bowl mystatus])]~

  ==
++  on-leave  on-leave:def
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  =/  mystatus-json  
    ^-  json
    :-  %o
    %-  malt
    %-  limo 
    :~  location+[%s location:mystatus]
        note+[%s note:mystatus]
        availability+[%s availability:mystatus]
    ==
  =*  getpal  |=  pal=[ship=@p location=@ta note=@ta =availability:status] 
  :-  %o
  %-  malt
  %-  limo
  :~  [%ship [%s (scot %p ship.pal)]]
      [%location [%s location.pal]]
      [%note [%s note.pal]]
      [%availability [%s availability.pal]]
  ==
  =/  paldata-json
    ^-  json
  [%a (turn ~(tap by paldata) getpal)]
  ?+    path  (on-peek:def path)
      :: [%x %mystatus ~]  ``json+!>(mystatus:state)
      :: [%x %paldata ~]   ``json+!>(paldata:state)
      [%x %mystatus ~]  ``json+!>(mystatus-json)
      [%x %paldata ~]   ``json+!>(paldata-json)
  ==
++  on-agent  
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+    wire  (on-agent:def wire sign)
      [%targets ~]
    ?+    -.sign  (on-agent:def wire sign)
        %watch-ack
      ?~  p.sign
        ((slog '%targets: Subscribe succeeded!' ~) `this)
      ((slog '%targets: Subscribe failed!' ~) `this)
        %kick
      %-  (slog '%targets: Got kick, resubscribing...' ~)
      :_  this
      :~  [%pass /targets %agent [our.bowl %pals] %watch /targets]
      ==
        %fact
      ?+    p.cage.sign  (on-agent:def wire sign)
          %pals-effect
        =/  effect  !<(effect:pals q.cage.sign)
        ?:  =(-.effect %meet)
          ?:  (~(has in leeches) +.effect)
            :_  %=  this  
                paldata  (~(put by paldata) +.effect ['' '' %off])
                targets  (~(put in targets) +.effect)
                ==
            [%pass /updates %agent [+.effect %status] %watch /updates]~
          [~ this(targets (~(put in targets) +.effect))]
        ?:  =(-.effect %part)
          ?:  (~(has in leeches) +.effect)
            :_  %=  this  
                paldata  (~(del by paldata) +.effect)
                targets  (~(put in targets) +.effect)
                ==
            [%pass /updates %agent [+.effect %status] %leave ~]~
          [~ this(targets (~(del in targets) +.effect))]
        `this
      ==
    ==
    ::
      [%leeches ~]
    ?+    -.sign  (on-agent:def wire sign)
        %watch-ack
      ?~  p.sign
        ((slog '%leeches: Subscribe succeeded!' ~) `this)
      ((slog '%leeches: Subscribe failed!' ~) `this)
        %kick
      %-  (slog '%leeches: Got kick, resubscribing...' ~)
      :_  this
      :~  [%pass /leeches %agent [our.bowl %pals] %watch /leeches]
      ==
        %fact
      ?+    p.cage.sign  (on-agent:def wire sign)
          %pals-effect
        =/  effect  !<(effect:pals q.cage.sign)
        ?:  =(-.effect %near)
          ?:  (~(has in targets) +.effect)
            :_  %=  this  
                paldata  (~(put by paldata) +.effect ['' '' %off])
                leeches  (~(put in leeches) +.effect)
                ==
            [%pass /updates %agent [+.effect %status] %watch /updates]~
          [~ this(leeches (~(put in leeches) +.effect))]
        ?:  =(-.effect %away)
          ?:  (~(has in targets) +.effect)
            :_  %=  this  
                paldata  (~(del by paldata) +.effect)
                leeches  (~(put in leeches) +.effect)
                ==
            [%pass /updates %agent [+.effect %status] %leave ~]~
          [~ this(leeches (~(del in leeches) +.effect))]
        `this
      ==
    ==
    ::
      [%updates ~]
    ?+    -.sign  (on-agent:def wire sign)
        %watch-ack
      ?~  p.sign
        ((slog '%updates: Subscribe succeeded!' ~) `this)
      ((slog '%updates: Subscribe failed!' ~) `this)
    ::
        %kick
      %-  (slog '%updates: Got kick, resubscribing...' ~)
      :_  this
      :~  [%pass /updates %agent [src.bowl %status] %watch /updates]
      ==
    ::
        %fact
      ~&  'update-fact-happened'
      ?+    p.cage.sign  (on-agent:def wire sign)
          %status-update
        =/  update  !<(update:status q.cage.sign)
        ~&  ship.update
        ~&  status.update
        :_  this(paldata (~(put by paldata) ship.update status.update))
        ~
      ==
    ==
  ==
::
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
