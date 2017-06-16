// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"
#include "ppapi/cpp/var_array.h"
#include "ppapi/cpp/var_dictionary.h"
#include <typeinfo>
#include "vector"
#include "string"
#include "map"
#include "cmath"
using namespace std;

namespace {

// The expected string sent by the browser.
//const char* const kHelloString = "break";
// The string sent back to the browser upon receipt of a message
// containing "hello".
//const char* const kReplyString = "hello from NaCl";

}  // namespace

class HelloTutorialInstance : public pp::Instance {
 public:
  explicit HelloTutorialInstance(PP_Instance instance)
      : pp::Instance(instance) {}
  virtual ~HelloTutorialInstance() {}

  virtual void HandleMessage(const pp::Var& globalBlocks) {
    if(!globalBlocks.is_array())
      return;


  //Form a vector of Important Features
  vector<string> names;
  names.push_back("-att-title");
  names.push_back("-style-font-size");
  names.push_back("-att-tagName");
  names.push_back("-att-className");
  names.push_back("-style-font-family");
  names.push_back("-style-width");
  names.push_back("-style-height");
  names.push_back("-att-childElementCount");
  names.push_back("-style-line-height");


  //Form the vector of Colours
  vector<string> colors;
  colors.push_back("3px solid red");
  colors.push_back("3px dotted #58D68D");
  colors.push_back("3px solid #0099ff");
  colors.push_back("3px dotted #996633");
  colors.push_back("3px solid #ffff00");
  colors.push_back("2.5px solid #884EA0");
  colors.push_back("2.5px solid #1A5276");


  // Form the back_list
  vector<string> back_list;
  back_list.push_back("white");
  back_list.push_back("#58D68D");
  back_list.push_back("white");
  back_list.push_back("#c6ebeb");
  back_list.push_back("#fbb6fb");
  back_list.push_back("white");
  back_list.push_back("#ebc6eb");

  vector< map<string,string> > dataset;
  pp::VarArray arr(globalBlocks);
  dataset = make_map_vector(arr);

  

  for(int i=0;i<dataset.size();i++)
  {
    vector<int> temp;
    for(int j =0; j< names.size();j++)
    {
      
      if(names[j]=="-att-title"||names[j]=="-att-tagName")
      {
        map<string,string> temp_val = dataset[i];
        temp.push_back(int(temp_val[names[j]].size()*100));
      }
      else if(names[j]=="-style-font-family"||names[j]=="-att-className")
      {
        map<string,string> temp_val = dataset[i];
        temp.push_back(int(temp_val[names[j]].size()*300));
      }
      else if(names[j]=="-style-width"||names[j]=="-style-height")
      {
        map<string,string> temp_val = dataset[i];
        temp.push_back(int(temp_val[names[j]].size()/10));
      }
      else
      {
        map<string,string> temp_val = dataset[i];
        temp.push_back(int(temp_val[names[j]].size()*800));
      }
    }
    cluster_data.push_back(temp);
  }
  //pp::VarArray answer(reverse_int_vector(cluster_data));
  //PostMessage(answer);

  vector< vector<int> > clusters;
  //clusters = find_clusters(cluster_data,10,7,visited);


  pp::VarArray answer(reverse_int_vector(clusters));
  PostMessage(answer);
  }


  // converting the input into the form that can be used by 
  // the C++ code and libraries
  vector< map<string,string> > make_map_vector(pp::VarArray arr);

  // converting the vector to form that can be sent back to
  // to the Javascript module
  pp::VarArray reverse_map_vector(vector< map<string,string> > v);


  pp::VarArray reverse_int_vector(vector< vector<int> > v);


  //Main functions for DBScan
  vector< vector<int> > find_clusters(vector<vector<int> > cluster_data,int epsilon,int min_points,vector<int> &visited);
  void expandCluster(int cluster_ID,vector<int> &neighbors,vector<int> &visited,vector<vector<int> > &clusters);
  void addToCluster(int point_ID, int cluster_ID,vector<vector<int> > &clusters);
  vector<int> find_neighbors(int point_ID);

  //Helper Functions
  void merge_Arrays(vector<int> &a,vector<int> b);
  float euclidean(vector<int> p, vector<int> q);

  int epsilon;
  int min_points;
  vector< vector<int> > clusters; // Check the dimension of clusters
  vector<int> noise;

  //Temporary variables for calculation
  vector<int> visited ;
  vector<int> assigned;
  vector<vector<int> > cluster_data;


};



// converting the input into the form that can be used by 
// the C++ code and libraries
vector< map<string,string> > HelloTutorialInstance::make_map_vector(pp::VarArray arr)
{
  vector< map<string,string> > v;
   for(int i =0;i<arr.GetLength();i++)
    {
      if(arr.Get(i).is_dictionary())
      {
        pp::VarDictionary temp(arr.Get(i));
        map<string,string> ans;
        pp::VarArray keys(temp.GetKeys());
        for(int i=0;i<keys.GetLength();i++)
        {
          if(temp.Get(keys.Get(i)).is_string())
            ans[keys.Get(i).AsString()] = temp.Get(keys.Get(i)).AsString();
          else
            ans[keys.Get(i).AsString()] = to_string(temp.Get(keys.Get(i)).AsInt());
        }
        v.push_back(ans);
      }    
    }
    return v;
}



// converting the vector to form that can be sent back to
// to the Javascript module
pp::VarArray HelloTutorialInstance::reverse_map_vector(vector< map<string,string> > v)
{
  pp::VarArray arr;
  arr.SetLength(v.size());

  for(int i=0;i<v.size();i++)
    {
      pp::VarDictionary temp;
      typedef map<string, string>::iterator it_type;
      for(it_type iterator = v[i].begin(); iterator != v[i].end(); iterator++) {
          temp.Set(iterator->first,iterator->second);
      }
      arr.Set(i,temp);
    }
    return arr;
}


pp::VarArray HelloTutorialInstance::reverse_int_vector(vector< vector<int> > v)
{
  pp::VarArray arr;
  arr.SetLength(v.size());

  for(int i=0;i<v.size();i++)
    {
      pp::VarArray temp;
      for(int j=0;j<v[i].size();j++)
      {
        temp.Set(j,v[i][j]);
      }
      arr.Set(i,temp);
    }
    return arr;
}

vector< vector<int> > HelloTutorialInstance::find_clusters(vector<vector<int> > dataset,int epsilon,int min_points,vector<int> &visited)
{
  vector<int> neighbors;
  visited.resize(dataset.size(),0);
  for(int point_ID = 0; point_ID < dataset.size();point_ID++)
  {
    if(visited[point_ID] !=1)
    {
      visited[point_ID] = 1;

      neighbors = find_neighbors(point_ID);

      if(neighbors.size() < min_points)
      {
        noise.push_back(point_ID);
      }
      else
      {
        int cluster_ID = clusters.size();
        vector<int> temp;
        clusters.push_back(temp);
        addToCluster(point_ID,cluster_ID,clusters);
        expandCluster(cluster_ID,neighbors,visited,clusters);
      }
    }
  }
  return clusters;
}

void HelloTutorialInstance::expandCluster(int cluster_ID,vector<int> &neighbors,vector<int> &visited,vector<vector<int> > &clusters)
{
  for(int i=0;i<neighbors.size();i++)
  {
    int point_ID2 = neighbors[i];

    if(visited[point_ID2] == 1)
    {
      visited[point_ID2] = 1;
      vector<int> neighbors2 = find_neighbors(point_ID2);

      if(neighbors2.size() >= min_points)
      {
        merge_Arrays(neighbors,neighbors2);
      }
    }

    if(assigned[point_ID2]!=1)
      addToCluster(point_ID2,cluster_ID,clusters);
  }
}

void HelloTutorialInstance::addToCluster(int point_ID, int cluster_ID,vector<vector<int> > &clusters)
{
  clusters[cluster_ID].push_back(point_ID);
  assigned[point_ID] = 1;
}

// Function to find all the neighbors of a given point
vector<int> HelloTutorialInstance::find_neighbors(int point_ID)
{
  vector<int> neighbors;

  for(int i=0;i<cluster_data.size();i++)
  {
    int dist = euclidean(cluster_data[point_ID],cluster_data[i]);
    if(dist < epsilon)
    {
      neighbors.push_back(i);
    }
  }
  return neighbors;
}


/***********************************************/
//Helper Functions

//Function to merge 2 arrays
void HelloTutorialInstance::merge_Arrays(vector<int> &a, vector<int> b)
{
  a.insert(a.end(),b.begin(),b.end());
  return;
}


// Function for finding the euclidean distance in a multidimensional space
float HelloTutorialInstance::euclidean(vector<int> p, vector<int> q)
{
  int sum = 0;
  int i = min(p.size(),q.size());

  while(i>0)
  {
    sum+= pow(p[i]-q[i],2);
    i--;
  }
  return sqrt(sum);
}








class HelloTutorialModule : public pp::Module {
 public:
  HelloTutorialModule() : pp::Module() {}
  virtual ~HelloTutorialModule() {}
  
  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new HelloTutorialInstance(instance);
  }
};

namespace pp {

Module* CreateModule() {
  return new HelloTutorialModule();
}

}  // namespace pp
