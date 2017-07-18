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
#include "iostream"
#include "fstream"
#include "iterator"

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


  pp::VarArray arr(globalBlocks);
  dataset = make_map_vector(arr);
  
  //pp::VarArray answer(reverse_int_vector(cluster_data));
  //initialise_cluster_values();
  third_idx = -1;
  find_inputs();
  feature_extraction();
  find_record_vec();
  find_field_in_record(first_idx);
  find_field_in_record(second_idx);
  if(third_idx!=-1)
    find_field_in_record(third_idx);
  //assign_clusters();

  //Convert cluster_indices -> cluster_values to return via NACL
  for(int i=0;i<dataset.size();i++)
  {
    cluster_values[dataset[i]["-vips-id"]] = cluster_indices[find_idx_vips_id(dataset[i]["-vips-id"])];
  }

  pp::VarDictionary answer(reverse_map(cluster_values));
  PostMessage(answer);

  }


  // converting the input into the form that can be used by 
  // the C++ code and libraries
  vector< map<string,string> > make_map_vector(pp::VarArray arr);

  // Finding the inputs given by the user
  void find_inputs();

  // Extracting the numerical features
  void feature_extraction();

  // Finding the vector of records
  // consists of the indices of each VIPS block in a particular record
  // of all records
  void find_record_vec();

  // Find the index of a VIPS block using VIPS id 
  int find_idx_vips_id(string str);

  // Function for finding a field in a record
  // with respect to input from user
  // using euclidean distance
  void find_field_in_record(int current_idx);

  // Helper to find the number of records
  int find_number_rec();




  int first_idx,second_idx,third_idx; // 1 input each for each field
  vector<int> cluster_indices; // main thing to return




   //Helper Functions

  //Euclidean distance between the features
  int find_euclidean(vector<int> A,vector<int> B);

  // converting the vector to form that can be sent back to
  // to the Javascript module
  pp::VarArray reverse_map_vector(vector< map<string,string> > v);
  pp::VarArray reverse_int_vector(vector< vector<int> > v);
  pp::VarDictionary reverse_map(map<string,int> my_map);


  
  // Numerical features of data for comparison
  vector<vector<int> > cluster_data;

  // Final Cluster values to return
  map <string,int> cluster_values;

  // Includes all indices which are in a particular record
  // Indexed by record_numer
  vector<vector<int> > record_vector;


  // Global Blocks dataset 
  vector< map<string,string> > dataset;


};



// Make Feature dataset 
void HelloTutorialInstance::feature_extraction()
{
  vector<string> names;

  names.push_back("-att-title");
  names.push_back("-style-font-size");
  names.push_back("-att-tagName");
  names.push_back("-att-className");
  names.push_back("-style-font-family");
  names.push_back("-style-width");
  names.push_back("-style-height");
  names.push_back("-att-childElementCount");
  names.push_back("-vips-startX");
  names.push_back("-vips-startY");
  //names.push_back("-style-line-height");

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

  for(int i=0;i<dataset.size();i++)
  {
    vector<int> temp;
    for(int j =0; j< names.size();j++)
    {
      if(names[j]=="-att-title"||names[j]=="-att-tagName")
      {
        temp.push_back(int(dataset[i][names[j]].length()*100));
      }
      else if(names[j]=="-style-font-family"||names[j]=="-att-className")
      {
        temp.push_back(int(dataset[i][names[j]].length()*300));
      }
      else if(names[j]=="-style-width"||names[j]=="-style-height")
      {
        string temp_str = dataset[i][names[j]];
        string s;
        for(int i=0;i<temp_str.length()-2;i++)
        {
          s.push_back(temp_str[i]);
        }
        temp.push_back(stoi(s)/10);
      }
      else if(names[j]=="-att-childElementCount")
      {
        temp.push_back(stoi(dataset[i][names[j]])*800);
      }
      else if(names[j]=="-vips-startX"||names[j]=="-vips-startY")
      {
        temp.push_back(stoi(dataset[i][names[j]]));
      }
      else
      {
        temp.push_back(stoi(dataset[i][names[j]])*800);
      }
    }
    cluster_data.push_back(temp);
  }
}




void HelloTutorialInstance::find_inputs()
{
  cluster_indices.resize(dataset.size(),0);
  for(int i=0;i<dataset.size();i++)
  {
    if(dataset[i]["-input"]=="1")
    {
      first_idx = i;
    }
    else if(dataset[i]["-input"]=="2")
    {
      second_idx = i;
    }
    else if(dataset[i]["-input"]=="3")
    {
      third_idx = i;
    }
    cluster_values[dataset[i]["-vips-id"]] = stoi(dataset[i]["-input"]);
  }
  cluster_indices[first_idx] = 1;
  cluster_indices[second_idx] = 2;
  if(third_idx!=-1)
    cluster_indices[third_idx] = 3;
}

// find number of records
int HelloTutorialInstance::find_number_rec()
{
  int number_rec = 0;
  for(int i=0;i<dataset.size();i++)
  {
    if(stoi(dataset[i]["-record-no"])>number_rec)
      number_rec = stoi(dataset[i]["-record-no"]);
  }
  return number_rec;
}

// Find the record_vector
// See definition for details
void HelloTutorialInstance::find_record_vec()
{
  int number_rec = find_number_rec(); // find number of records
  record_vector.resize(number_rec);

  for(int rec_idx=0;rec_idx<number_rec;rec_idx++)
  {
    for(int i=0;i<dataset.size();i++)
    {
      if(stoi(dataset[i]["-record-no"])==rec_idx)
      {
        record_vector[rec_idx].push_back(i);
      }
    }
  }

}

// Finding the particular field in a record
// using euclidean distance
void HelloTutorialInstance::find_field_in_record(int current_idx)
{
  for(int i=0;i<record_vector.size();i++)
  {
    int field_idx = 0;
    for(int j=0;j<record_vector[i].size();j++)
    {
        if(find_euclidean(cluster_data[current_idx],cluster_data[record_vector[i][j]])<find_euclidean(cluster_data[current_idx],cluster_data[record_vector[i][field_idx]]))
        {
          field_idx = j;
        }
    }
    cluster_indices[record_vector[i][field_idx]] = cluster_indices[current_idx];
  }
  
}
/*
// To fix the records by taking input from the user
void HelloTutorialInstance::fix_clusters(vector<int> fix_idx,vector<int> cluster_idx)
{

  for(int c_idx=0; c_idx<fix_idx.size();c_idx++)
  {
    if(cluster_indices[fix_idx[c_idx]]!=cluster_idx[c_idx])
    {
        cluster_indices[fix_idx[c_idx]] = cluster_idx[c_idx]
    }
  }
}
*/


/*
void HelloTutorialInstance::assign_clusters()
{

  for(int c_idx=0; c_idx<cluster_data.size();c_idx++)
  {
    
  }
}
*/


// Find the euclidean distance between 2 vectors
int HelloTutorialInstance::find_euclidean(vector<int> A,vector<int> B)
{
  int sum = 0;
  for(int i=0;i<A.size()-2;i++) // To avoid StartX and startY I subtract a 2
  {
    if(i!=7)
      sum+= pow(A[i]-B[i],2);
  }
  return sqrt(sum);
}



// Find the index of a particular id for simplicity
// of using cluster_data
int HelloTutorialInstance::find_idx_vips_id(string str)
{
    for(int i=0;i< dataset.size();i++)
    {
      if(str.compare(dataset[i]["-vips-id"])==0)
      {
        return i;
      }
    }
    return -1;
}



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

// convert vector to pp::VarArray
// To send back to the Javascript module
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

// convert map to pp::VarDictionary
// To send back to the Javascript module
pp::VarDictionary HelloTutorialInstance::reverse_map(map<string,int> my_map)
{
  pp::VarDictionary dict;

  typedef map<string, int>::iterator it_type;
      for(it_type iterator = my_map.begin(); iterator != my_map.end(); iterator++) {
          dict.Set(iterator->first,iterator->second);
      }

  return dict;


}






// Ending

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
