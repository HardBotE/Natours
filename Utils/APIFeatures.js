class APIFeatures{
  constructor(query,queryString) {
    this.query=query;
    this.queryString=queryString;
  }
  filter(){
    //Base Query
    const queryObj={...this.queryString};
    const excludedFields=['page','sort','limit','fields'];
    excludedFields.forEach(el=>{delete queryObj[el];});

    //Advanced Query: qt,qte,lt,lte
    let queryString=JSON.stringify(queryObj);
    queryString= queryString.replace(/\b(qt|gte|lt|lte)\b/g,match=>`$${match}`);
    this.query=this.query.find(JSON.parse(queryString));

    return this;
  }

  sort(){
    //Sorting
    if(this.queryString.sort)
    {
      const sortBy=this.queryString.sort.split(',').join(' ');
      this.query=this.query.sort(sortBy);
    }
    else
    {
      this.query=this.query.sort('-createdAt');
    }
    return this;
  }

  limiting(){
    //Limiting field
    if(this.queryString.fields)
    {
      const limitingField=this.queryString.fields.split(',').join(' ');
      this.query=this.query.select(limitingField);
    }
    else
    {
      this.query=this.query.select('-__v')
    }
    return this;
  }
  paginate(){
    //pagination
    const page=this.queryString.page *1 ||1;
    const limit=this.queryString.limit *1||100;
    const skip=(page-1)*limit;

    this.query=this.query.skip(skip).limit(limit);

    return this;
  }

}
module.exports={APIFeatures};