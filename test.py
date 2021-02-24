class parent():
    def __init__(self,data):
        self.data=data
        self.p_data=3
        
        
class child(parent):
    def __init__(self,c_data):
        super().__init__(p_data)
        self.c_data=c_data
        
c=child(1)
print(c.p_data)