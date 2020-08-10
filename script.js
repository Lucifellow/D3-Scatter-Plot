const req = new XMLHttpRequest();
req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",true)
req.send();
req.onload=function(){
    const dataSet= JSON.parse(req.responseText);
    const w = 900;
    const h = 600;
    const padding = 35;

    //x-axis scale
    const xScale = d3.scaleLinear()
                    .domain([d3.min(dataSet,(d)=>getYear(d.Year))-1
                        ,d3.max(dataSet,(d)=>getYear(d.Year))+1])
                    .range([padding,w-padding]);

    //y-axis scale
    const yScale=d3.scaleTime()
                        .domain([new Date("2020 00:40:00")
                        ,new Date("2020 00:36:40")])
                        .range([h-padding,padding])

    const svg = d3.select(".container-fluid")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h);
    
    const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"));

    const legend = svg.append("g")
                    .attr("id","legend")
    
    const tooltip = d3.select(".container-fluid")
                        .append("div")
                        .attr("id","tooltip")
    
    svg.append("g")
        .attr("id","x-axis")
        .attr("transform","translate(0,"+(h-padding)+")")
        .call(xAxis);
    
    svg.append("text")
        .attr("id","x-axis-label")
        .attr("transform","translate("+(w/2)+","+(h-2)+")")
        .text("Year");

    svg.append("g")
    .attr("id","y-axis")
    .attr("transform","translate("+(padding)+",0)")
    .call(yAxis);

    svg.append("text")
        .attr("id","y-axis-label")
        .attr("transform","rotate(-90)")
        .attr("x",-170)
        .attr("y",padding+(padding/2))
        .text("Time to finish race")

    svg.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("cx",(d,i)=>xScale(d.Year))
        .attr("cy",(d,i)=>yScale(new Date("2020 00:" +d.Time)))
        .attr("r",5)
        .attr("data-xvalue",(d,i)=>getYear(d.Year))
        .attr("data-yvalue",(d,i)=>new Date("2020 00:"+d.Time))
        .style("fill",(d,i)=>isDoping(d.Doping==""))
        .on("mouseover",(d,i)=>{
            tooltip.style("left",xScale(d.Year)-350+"px")
            .style("top",event.pageY-padding*4.5+"px")
            .style("display","inline-block")
            .style("background-color","black")
            .style("color","white")
            .style("opacity","0.7")
            .html(d.Name+"<br> Year: "
                    +d.Year+"<br> Country: "
                    +d.Nationality+"<br> Position in race: "
                    +d.Place+"<br> Doping: "
                    +d.Doping)
            .attr("data-year",getYear(d.Year))
        })
        .on("mouseout",(d,i)=>{
            tooltip.style("display","none")
        })
    
    legend.append("circle")
          .attr("cx",w-150)
          .attr("cy",h/2-padding)
          .attr("r",7)
          .style("fill","rgb(9, 255, 0)")
    
    legend.append("text")
          .attr("x",w-130)
          .attr("y",h/2-padding+5)
          .text("-  No Doping")

    legend.append("circle")
          .attr("cx",w-150)
          .attr("cy",h/2)
          .attr("r",7)
          .style("fill","orangered")
    
    legend.append("text")
          .attr("x",w-130)
          .attr("y",h/2+5)
          .text("- Riders Doping")
    
    
}

function getYear(d){
    return(parseInt(d));
}

function isDoping(d){
    if(d!=""){
        return "rgb(9, 255, 0)";
    }
}